/**
 * The facts the legal pages are built on, kept in one place.
 *
 * ⚠️ FILL THESE IN BEFORE OPENING THE APP TO STRANGERS. Spanish law (LSSI art.
 * 10) requires a website offering a service to identify who runs it, and the
 * GDPR requires the privacy policy to name the data controller and how to
 * reach them. The bracketed values render as-is on /privacy and /terms until
 * they are replaced, which is deliberate: a visible gap is fixable, an
 * invented name or tax number is not.
 */
export const LEGAL = {
  /** Who runs KitVault: your full name, or the company's registered name. */
  controller: "[NOMBRE Y APELLIDOS O RAZÓN SOCIAL]",
  /** NIF / NIE, or the company's CIF. */
  taxId: "[NIF]",
  /** Postal address for legal notices. */
  address: "[DIRECCIÓN POSTAL]",
  /** Where people write to exercise their rights. Must be read regularly. */
  contactEmail: "[CORREO DE CONTACTO]",
  /**
   * Where the Supabase project lives: Supabase → Project Settings → General →
   * Region. Write it as people would read it, e.g. "Frankfurt (EU)".
   */
  supabaseRegion: "[REGIÓN DE SUPABASE]",
  /** Bump this whenever either document changes in substance. */
  updated: "2026-10-19",
} as const;

/** Values the documents interpolate with `fill()`. */
export const LEGAL_VARS: Record<string, string> = { ...LEGAL };
