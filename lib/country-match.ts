/**
 * Matching free-form country names onto the world map.
 *
 * `shirts.country` is free text — Gemini or the user can write anything — while
 * the map only knows Natural Earth's names. This bridges the two.
 */

/** Lowercase, strip accents and punctuation: "Côte d'Ivoire" → "cote divoire". */
export function normalizeCountryName(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Normalised input → Natural Earth country name.
 *
 * The football-shaped entries matter most: the home nations have national
 * teams but no ISO country, so England, Scotland, Wales and Northern Ireland
 * all land on the United Kingdom shape.
 */
const ALIASES: Record<string, string> = {
  // Home nations — separate football associations, one country on the map.
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  "northern ireland": "United Kingdom",
  britain: "United Kingdom",
  "great britain": "United Kingdom",
  uk: "United Kingdom",

  // Ireland
  "republic of ireland": "Ireland",
  eire: "Ireland",

  // Long / short forms
  usa: "United States of America",
  us: "United States of America",
  "united states": "United States of America",
  uae: "United Arab Emirates",
  emirates: "United Arab Emirates",
  holland: "Netherlands",
  "the netherlands": "Netherlands",
  "czech republic": "Czechia",
  "russian federation": "Russia",
  turkiye: "Turkey",
  burma: "Myanmar",
  swaziland: "eSwatini",
  "east timor": "Timor-Leste",
  zaire: "Dem. Rep. Congo",

  // Korea
  korea: "South Korea",
  "korea republic": "South Korea",
  "republic of korea": "South Korea",
  "korea dpr": "North Korea",
  "dpr korea": "North Korea",

  // Names the atlas abbreviates
  "bosnia and herzegovina": "Bosnia and Herz.",
  "bosnia herzegovina": "Bosnia and Herz.",
  bosnia: "Bosnia and Herz.",
  "north macedonia": "Macedonia",
  "central african republic": "Central African Rep.",
  "dominican republic": "Dominican Rep.",
  "equatorial guinea": "Eq. Guinea",
  "south sudan": "S. Sudan",
  "western sahara": "W. Sahara",
  "solomon islands": "Solomon Is.",
  "falkland islands": "Falkland Is.",
  "northern cyprus": "N. Cyprus",

  // Congos
  "dr congo": "Dem. Rep. Congo",
  "congo dr": "Dem. Rep. Congo",
  "democratic republic of congo": "Dem. Rep. Congo",
  "democratic republic of the congo": "Dem. Rep. Congo",
  "republic of the congo": "Congo",
  "congo brazzaville": "Congo",

  // Ivory Coast
  "ivory coast": "Côte d'Ivoire",
};

/** Normalised country name → map country id. */
export type CountryIndex = Map<string, string>;

/** Build the lookup from the geometry the API returned. */
export function buildCountryIndex(
  countries: ReadonlyArray<{ id: string; name: string }>,
): CountryIndex {
  const byName = new Map<string, string>();
  for (const country of countries) {
    byName.set(normalizeCountryName(country.name), country.id);
  }

  const index: CountryIndex = new Map(byName);
  for (const [alias, target] of Object.entries(ALIASES)) {
    const id = byName.get(normalizeCountryName(target));
    if (id) index.set(normalizeCountryName(alias), id);
  }
  return index;
}

/**
 * Map one free-text country onto a map country id, or `null` when there is no
 * shape for it — microstates like Andorra, San Marino and Gibraltar have
 * national teams but are too small for this dataset.
 */
export function matchCountry(raw: string, index: CountryIndex): string | null {
  const key = normalizeCountryName(raw);
  if (!key) return null;
  return index.get(key) ?? null;
}
