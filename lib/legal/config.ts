/**
 * The facts the legal pages are built on, kept in one place.
 *
 * Spanish law (LSSI art. 10) requires a website offering a service to identify
 * who runs it, and the GDPR requires the privacy policy to name the data
 * controller and how to reach them. A value left empty drops its line from the
 * pages instead of rendering it blank.
 */
export const LEGAL = {
  /** Who runs KitVault: your full name, or the company's registered name. */
  controller: "Marc Ferrer Margarit",
  /**
   * NIF / NIE, or the company's CIF. Left empty for now: a line whose value is
   * empty is dropped from the pages rather than shown blank. Add it — and the
   * address — before charging anyone; LSSI art. 10 expects both from a
   * service with economic activity.
   */
  taxId: "",
  /** Postal address for legal notices. Empty for now, see `taxId`. */
  address: "",
  /** Where people write to exercise their rights. Must be read regularly. */
  contactEmail: "kitvaultdev@gmail.com",
  /**
   * Where the Supabase project lives: Supabase → Project Settings → General →
   * Region. The documents say the data is stored in the EU, so if this ever
   * moves outside it, change their wording too.
   */
  supabaseRegion: "Frankfurt (eu-central-1)",
  /** Bump this whenever either document changes in substance. */
  updated: "2026-10-19",
} as const;

/** Values the documents interpolate with `fill()`. */
export const LEGAL_VARS: Record<string, string> = { ...LEGAL };
