import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import {
  fetchQuota,
  quotaDenialMessage,
  type QuotaDenialReason,
} from "@/lib/quota";
import { VERSIONS } from "@/lib/mock-data";
import { fill } from "@/lib/i18n/format";
import { getTranslations } from "@/lib/i18n/server";

// Vercel functions default to a 10s ceiling and a vision call with a photo can
// get close to it. 60s is the most the Hobby plan allows.
export const maxDuration = 60;

// Cheap, fast, vision-capable model with structured output.
const MODEL = "gemini-2.5-flash";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

/** Row returned by the `consume_ai_credit()` Postgres function. */
interface CreditRow {
  allowed: boolean;
  reason: string;
  usage_id: string | null;
  remaining: number;
  resets_at: string;
}

/**
 * POST /api/identify
 * Body: multipart/form-data with an `image` file.
 * Returns the AI's best guess of the shirt's metadata + token usage.
 */
export async function POST(request: Request) {
  // Errors from here reach the user's screen, so they follow their language.
  const { t } = await getTranslations();

  // Only signed-in users may spend the API budget.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: t.errors.notSignedIn }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: t.errors.geminiMissing },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const image = form.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: t.errors.noImage }, { status: 400 });
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json(
      { error: t.errors.imageTooLarge },
      { status: 400 },
    );
  }

  // Everything above is free to reject. From here on the request costs money,
  // so claim a credit first: this enforces the app-wide daily cap, the
  // per-minute burst guard and the user's plan quota in a single statement.
  const { data: credit, error: creditError } = await supabase
    .rpc("consume_ai_credit", { p_model: MODEL })
    .single<CreditRow>();

  if (creditError || !credit) {
    console.error("[identify] quota check failed:", creditError?.message);
    return NextResponse.json({ error: t.errors.quotaCheck }, { status: 500 });
  }

  if (!credit.allowed) {
    const quota = await fetchQuota(supabase);
    const reason = credit.reason as QuotaDenialReason;
    return NextResponse.json(
      { error: quotaDenialMessage(reason, quota, t), reason, quota },
      {
        status: 429,
        headers: reason === "burst" ? { "Retry-After": "60" } : {},
      },
    );
  }

  const usageId = credit.usage_id;
  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");

  const prompt = `You are an expert in identifying football (soccer) shirts.
Analyse the shirt in the image and identify it as accurately as you can.
Return:
- team: the club or national team name.
- season: format "YYYY-YY" (e.g. "2019-20"); best estimate.
- version: one of Home, Away, Third or GK.
- manufacturer: the exact brand (e.g. "Adidas", "Castore", "Meyba"…).
- country: the country of the team (e.g. "Spain", "Brazil"…).
- league: the exact league name (e.g. "LaLiga", "Championship", "Serie B").
  Use an empty string "" if the team has no league (national teams, friendlies).
- confidence: integer 0-100, your confidence in the team + season.
Give your best real-world value for each field — do not restrict yourself to a
fixed list. If unsure, still provide your best estimate.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: image.type || "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        // Thinking tokens bill as output ($2.50/1M) and buy nothing here: the
        // answer is constrained by the schema below. Off = cheaper + faster.
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            team: { type: Type.STRING },
            season: { type: Type.STRING },
            // Only version is a closed set; the rest are free-form.
            version: { type: Type.STRING, enum: VERSIONS as string[] },
            manufacturer: { type: Type.STRING },
            country: { type: Type.STRING },
            league: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: [
            "team",
            "season",
            "version",
            "manufacturer",
            "country",
            "league",
            "confidence",
          ],
        },
      },
    });

    const text = result.text;
    if (!text) {
      await releaseCredit(supabase, usageId);
      return NextResponse.json({ error: t.errors.emptyModel }, { status: 502 });
    }

    const parsed = JSON.parse(text) as Record<string, unknown>;
    const usage = result.usageMetadata;

    // Settle the reservation with the real token counts — `ai_usage` doubles
    // as the cost ledger, so this is what we bill and budget against.
    if (usageId) {
      await supabase.rpc("record_ai_usage", {
        p_usage_id: usageId,
        p_input: usage?.promptTokenCount ?? null,
        p_output: usage?.candidatesTokenCount ?? null,
        p_total: usage?.totalTokenCount ?? null,
      });
    }

    console.log(
      `[identify] model=${MODEL} tokens in=${usage?.promptTokenCount ?? "?"} out=${usage?.candidatesTokenCount ?? "?"} total=${usage?.totalTokenCount ?? "?"}`,
    );

    return NextResponse.json({
      quota: await fetchQuota(supabase),
      team: String(parsed.team ?? "").trim(),
      season: String(parsed.season ?? "").trim(),
      version: VERSIONS.includes(parsed.version as (typeof VERSIONS)[number])
        ? parsed.version
        : "Home",
      manufacturer: String(parsed.manufacturer ?? "").trim() || "Other",
      country: String(parsed.country ?? "").trim(),
      league: String(parsed.league ?? "").trim(),
      confidence: Math.max(
        0,
        Math.min(100, Math.round(Number(parsed.confidence) || 0)),
      ),
      usage: {
        input: usage?.promptTokenCount ?? null,
        output: usage?.candidatesTokenCount ?? null,
        total: usage?.totalTokenCount ?? null,
      },
    });
  } catch (err) {
    // Hand the credit back — a failed call costs nothing, so it should not
    // count against the user's daily allowance.
    await releaseCredit(supabase, usageId);
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[identify] error:", message);
    return NextResponse.json(
      { error: fill(t.errors.identifyFailed, { error: message }) },
      { status: 502 },
    );
  }
}

/** Best-effort refund of a reserved credit; never throws. */
async function releaseCredit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  usageId: string | null,
) {
  if (!usageId) return;
  const { error } = await supabase.rpc("release_ai_credit", {
    p_usage_id: usageId,
  });
  if (error) console.error("[identify] credit release failed:", error.message);
}
