/** The languages the interface is available in. */
export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie the chosen language is remembered in. */
export const LOCALE_COOKIE = "kitvault_locale";

/** A year: the choice should outlive the session comfortably. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Pick a language from an `Accept-Language` header, used the first time
 * someone arrives without a cookie.
 */
export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  // e.g. "es-ES,es;q=0.9,en;q=0.8" → ["es-es", "es", "en"]
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean) as string[];

  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
