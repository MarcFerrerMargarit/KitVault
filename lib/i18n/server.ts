import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  localeFromAcceptLanguage,
  type Locale,
} from "./config";
import { en, type Messages } from "./messages/en";
import { es } from "./messages/es";

const MESSAGES: Record<Locale, Messages> = { en, es };

/**
 * The language for this request: an explicit choice first, then whatever the
 * browser asks for, then English.
 *
 * Reading the cookie opts every page into dynamic rendering. That is the
 * price of choosing language by cookie rather than by URL: one HTML document
 * cannot be correct for both languages, so it cannot be cached as one.
 */
export async function getLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const accept = (await headers()).get("accept-language");
  return localeFromAcceptLanguage(accept) ?? DEFAULT_LOCALE;
}

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** Locale and its messages together, for server components. */
export async function getTranslations(): Promise<{
  locale: Locale;
  t: Messages;
}> {
  const locale = await getLocale();
  return { locale, t: messagesFor(locale) };
}
