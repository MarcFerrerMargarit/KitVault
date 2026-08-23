"use client";

import * as React from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages/en";

interface I18nValue {
  locale: Locale;
  t: Messages;
}

const I18nContext = React.createContext<I18nValue | null>(null);

/**
 * Hands the request's messages to client components. The whole dictionary is
 * passed down rather than fetched: it is a few kilobytes, and any other
 * arrangement means a flash of the wrong language.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ locale, t: messages }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
