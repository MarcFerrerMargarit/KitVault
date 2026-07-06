import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { VERSIONS } from "@/lib/mock-data";

// Cheap, fast, vision-capable model with structured output.
const MODEL = "gemini-2.5-flash";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/identify
 * Body: multipart/form-data with an `image` file.
 * Returns the AI's best guess of the shirt's metadata + token usage.
 */
export async function POST(request: Request) {
  // Only signed-in users may spend the API budget.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const image = form.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 400 });
  }

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
      return NextResponse.json(
        { error: "Empty response from the model" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(text) as Record<string, unknown>;
    const usage = result.usageMetadata;

    // Log token usage so we can gauge cost per identification.
    console.log(
      `[identify] model=${MODEL} tokens in=${usage?.promptTokenCount ?? "?"} out=${usage?.candidatesTokenCount ?? "?"} total=${usage?.totalTokenCount ?? "?"}`,
    );

    return NextResponse.json({
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
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[identify] error:", message);
    return NextResponse.json(
      { error: `Identification failed: ${message}` },
      { status: 502 },
    );
  }
}
