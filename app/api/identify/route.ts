import { NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import {
  fetchQuota,
  quotaDenialMessage,
  type QuotaDenialReason,
} from "@/lib/quota";
import { VERSIONS } from "@/lib/mock-data";
import {
  PROMPT_VERSION,
  RESPONSE_SCHEMA,
  buildPrompt,
  cleanAlternatives,
  cleanEvidence,
  topDistinct,
} from "@/lib/identify-prompt";
import { fill } from "@/lib/i18n/format";
import { getTranslations } from "@/lib/i18n/server";

// Vercel functions default to a 10s ceiling and a vision call with a photo can
// get close to it. 60s is the most the Hobby plan allows.
export const maxDuration = 60;

/**
 * Cheap, fast, vision-capable model with structured output. The Flash tier is
 * the right trade here: identifying a shirt needs good vision, not deep
 * reasoning, and Pro costs six times as much to think about something the
 * response schema has already decided.
 *
 * Overridable so a different model can be tried — and reverted — from the
 * hosting dashboard, without a deploy. `ai_usage.model` records which one
 * actually ran, so the ledger stays honest across a switch.
 *
 * The request below is written for the Gemini 3 family, which differs from
 * 2.5 in two ways that matter here. Thinking is set by level, not by token
 * budget, and cannot be switched off — LOW is the floor, since `minimal` is
 * rejected by 3.8. And sampling parameters (`temperature`, `top_p`, `top_k`) are
 * ignored today and slated to become a 400, so none are sent: repeatable output
 * comes from the response schema, not from a low temperature.
 */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

/**
 * How hard the model thinks before answering. LOW is the cheapest and fastest;
 * MEDIUM or HIGH may identify obscure kits better at a higher cost and latency.
 * Overridable like the model, and stored with each prediction, so the trade
 * can be measured from `ai_corrections` rather than guessed.
 */
const THINKING_LEVEL: ThinkingLevel = (() => {
  const wanted = process.env.GEMINI_THINKING_LEVEL?.trim().toUpperCase();
  return wanted === "MEDIUM" || wanted === "HIGH"
    ? ThinkingLevel[wanted]
    : ThinkingLevel.LOW;
})();
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

  // The user's existing names, so a new shirt reuses "FC Barcelona" rather
  // than adding a "Barcelona" beside it — filters and the map count by exact
  // spelling. Best effort: a failed read just means no hints.
  const [base64, known] = await Promise.all([
    image.arrayBuffer().then((buf) => Buffer.from(buf).toString("base64")),
    supabase
      .from("shirts")
      .select("team, league, manufacturer")
      .eq("user_id", user.id)
      .limit(2000)
      .then(({ data }) => ({
        teams: topDistinct((data ?? []).map((r) => r.team as string)),
        leagues: topDistinct((data ?? []).map((r) => r.league as string)),
        manufacturers: topDistinct(
          (data ?? []).map((r) => r.manufacturer as string),
        ),
      })),
  ]);

  const prompt = buildPrompt(known);

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
        thinkingConfig: { thinkingLevel: THINKING_LEVEL },
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = result.text;
    if (!text) {
      await releaseCredit(supabase, usageId);
      return NextResponse.json({ error: t.errors.emptyModel }, { status: 502 });
    }

    const parsed = JSON.parse(text) as Record<string, unknown>;
    const usage = result.usageMetadata;
    // Thought tokens are reported apart from the answer but billed as output.
    // Gemini 3 cannot turn thinking off, so leaving them out of the ledger
    // would understate every call's cost.
    const outputTokens =
      usage?.candidatesTokenCount == null && usage?.thoughtsTokenCount == null
        ? null
        : (usage?.candidatesTokenCount ?? 0) + (usage?.thoughtsTokenCount ?? 0);

    // Settle the reservation with the real token counts — `ai_usage` doubles
    // as the cost ledger, so this is what we bill and budget against.
    if (usageId) {
      await supabase.rpc("record_ai_usage", {
        p_usage_id: usageId,
        p_input: usage?.promptTokenCount ?? null,
        p_output: outputTokens,
        p_total: usage?.totalTokenCount ?? null,
      });
    }

    console.log(
      `[identify] model=${MODEL} tokens in=${usage?.promptTokenCount ?? "?"} out=${outputTokens ?? "?"} (thinking ${usage?.thoughtsTokenCount ?? 0}) total=${usage?.totalTokenCount ?? "?"}`,
    );

    const team = String(parsed.team ?? "").trim();
    const season = String(parsed.season ?? "").trim();
    const version = VERSIONS.includes(
      parsed.version as (typeof VERSIONS)[number],
    )
      ? (parsed.version as string)
      : "Home";
    const manufacturer = String(parsed.manufacturer ?? "").trim() || "Other";
    const country = String(parsed.country ?? "").trim();
    const league = String(parsed.league ?? "").trim();
    const confidence = Math.max(
      0,
      Math.min(100, Math.round(Number(parsed.confidence) || 0)),
    );
    const alternativeSeasons = cleanAlternatives(
      parsed.alternativeSeasons,
      season,
    );
    const evidence = cleanEvidence(parsed.evidence);

    return NextResponse.json({
      quota: await fetchQuota(supabase),
      team,
      season,
      alternativeSeasons,
      version,
      manufacturer,
      country,
      league,
      confidence,
      // What gets stored in `ai_corrections.predicted` when the shirt is saved:
      // the answer plus what produced it, so accuracy can be compared across
      // models, prompt versions and thinking levels — and the evidence, so a
      // wrong answer can be traced to what the model thought it saw.
      prediction: {
        team,
        season,
        alternativeSeasons,
        version,
        manufacturer,
        country,
        league,
        confidence,
        evidence,
        model: MODEL,
        promptVersion: PROMPT_VERSION,
        thinkingLevel: THINKING_LEVEL,
      },
      usage: {
        input: usage?.promptTokenCount ?? null,
        output: outputTokens,
        total: usage?.totalTokenCount ?? null,
      },
    });
  } catch (err) {
    // Hand the credit back — a failed call costs nothing, so it should not
    // count against the user's daily allowance.
    await releaseCredit(supabase, usageId);
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[identify] error:", message);

    // Gemini's own rate limit, which several people uploading at the same
    // moment will hit. Its raw text ("429 Too Many Requests: Resource has been
    // exhausted") reaches the user's screen through `identifyFailed` below and
    // reads like a bug in KitVault, so answer the one thing they can act on:
    // nothing is broken, wait a moment and try again.
    if (/\b429\b|RESOURCE_EXHAUSTED|rate limit/i.test(message)) {
      return NextResponse.json(
        { error: t.errors.modelBusy, reason: "model_busy" },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }

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
