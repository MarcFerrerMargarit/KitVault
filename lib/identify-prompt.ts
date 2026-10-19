import { Type, type Schema } from "@google/genai";
import { VERSIONS } from "@/lib/mock-data";

/**
 * Bump whenever the prompt or the schema changes in a way that could move
 * accuracy. It is stored with every prediction, so `ai_corrections` can tell
 * one version's hit rate from another's.
 */
export const PROMPT_VERSION = 2;

/**
 * How many of the user's own names are offered per field. Enough to cover a
 * serious collection's teams; few enough that the prompt stays cheap.
 */
const MAX_KNOWN = 150;

/** Names already in the user's collection, so new shirts reuse their spelling. */
export interface KnownNames {
  teams: string[];
  leagues: string[];
  manufacturers: string[];
}

/** Distinct, non-empty values, most frequent first, capped. */
export function topDistinct(values: (string | null | undefined)[]): string[] {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const v = raw?.trim();
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_KNOWN)
    .map(([v]) => v);
}

function knownBlock(known: KnownNames): string {
  const lines = [
    known.teams.length && `Teams: ${known.teams.join("; ")}`,
    known.leagues.length && `Leagues: ${known.leagues.join("; ")}`,
    known.manufacturers.length &&
      `Manufacturers: ${known.manufacturers.join("; ")}`,
  ].filter(Boolean);
  if (lines.length === 0) return "";
  return `
The user's collection already uses these names. If the shirt's team, league or
manufacturer is one of them — under any spelling or nickname — return exactly
the spelling below, so their collection stays consistent. Otherwise use the
usual English name.
${lines.join("\n")}
`;
}

/**
 * The instructions. The order of work matters more than the wording: the model
 * is made to write down what it can actually see before it commits to an
 * answer, and the schema below puts `evidence` first so the answer is generated
 * after it. Seasons are where identification goes wrong, and seasons are pinned
 * by small details — a sponsor, a sleeve patch, a tag — that a model asked
 * straight for "the season" skips past.
 */
export function buildPrompt(known: KnownNames): string {
  return `You are an expert in football (soccer) shirts: club and national-team kits,
their manufacturers and their sponsors, season by season.

Identify the shirt in the photo. Work in this order.

1. Write down the evidence you can actually see, in the \`evidence\` fields:
   the crest, the sponsor (exactly as printed), the manufacturer's logo, any
   badges or patches (league sleeve patches, competition badges, champion
   stars), and any other text (inside labels or tags, product codes, names,
   numbers). Leave a field as "" when you cannot see it. Never infer a sponsor,
   badge or text you cannot read in the photo.
2. Use that evidence to place the shirt. Sponsors, manufacturers and crest
   versions change on known dates; collar and trim templates belong to one
   manufacturer range for a season or two; sleeve patches and badges are
   season-specific; a product code on a tag is the strongest clue of all.
3. Then answer:
- team: the club or national team, by its usual English name.
- season: "YYYY-YY" (e.g. "2019-20"). For a national team, the season the kit
  was released in, in the same format.
- alternativeSeasons: up to two other seasons that are genuinely plausible —
  when the same design was worn for more than one season, or the details that
  would settle it are not visible. [] when the evidence settles it.
- version: one of Home, Away, Third or GK.
- manufacturer: the brand (e.g. "Adidas", "Castore", "Meyba").
- country: the team's country, in English (e.g. "Spain", "Brazil").
- league: the league the team played in that season (e.g. "LaLiga",
  "Championship", "Serie B"); "" for national teams.
- confidence: 0-100, for team and season together. Stay below 50 when the
  season rests on the design alone, with no sponsor, badge or tag to confirm it.

Always give your best real-world answer rather than refusing; the user reviews
it before saving.
${knownBlock(known)}`;
}

const EVIDENCE_FIELDS = [
  "crest",
  "sponsor",
  "manufacturerLogo",
  "badges",
  "otherText",
] as const;

const ANSWER_FIELDS = [
  "team",
  "season",
  "alternativeSeasons",
  "version",
  "manufacturer",
  "country",
  "league",
  "confidence",
] as const;

/**
 * Structured output. Kept to the keywords Gemini's schema subset accepts —
 * length and size limits are trimmed in code instead, since unsupported
 * keywords are reported to fail requests on Gemini 3.
 */
export const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    evidence: {
      type: Type.OBJECT,
      properties: Object.fromEntries(
        EVIDENCE_FIELDS.map((f) => [f, { type: Type.STRING }]),
      ),
      required: [...EVIDENCE_FIELDS],
      propertyOrdering: [...EVIDENCE_FIELDS],
    },
    team: { type: Type.STRING },
    season: { type: Type.STRING },
    alternativeSeasons: { type: Type.ARRAY, items: { type: Type.STRING } },
    // Only version is a closed set; the rest are free-form.
    version: { type: Type.STRING, enum: VERSIONS as string[] },
    manufacturer: { type: Type.STRING },
    country: { type: Type.STRING },
    league: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
  },
  required: ["evidence", ...ANSWER_FIELDS],
  // Generation follows this order: evidence first, answer after.
  propertyOrdering: ["evidence", ...ANSWER_FIELDS],
};

export type Evidence = Record<(typeof EVIDENCE_FIELDS)[number], string>;

/** The evidence block, as strings, whatever the model actually returned. */
export function cleanEvidence(raw: unknown): Evidence {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  return Object.fromEntries(
    EVIDENCE_FIELDS.map((f) => [f, String(obj[f] ?? "").trim().slice(0, 300)]),
  ) as Evidence;
}

/** At most two distinct alternatives, none equal to the main answer. */
export function cleanAlternatives(raw: unknown, season: string): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set([season]);
  const out: string[] = [];
  for (const item of raw) {
    const s = String(item ?? "").trim();
    if (!s || s.length > 20 || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length === 2) break;
  }
  return out;
}
