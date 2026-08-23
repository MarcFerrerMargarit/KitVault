"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_LABELS,
  type Locale,
} from "@/lib/i18n/config";
import { useI18n } from "@/components/I18nProvider";

/**
 * Language picker.
 *
 * The choice is a cookie, and the pages are server-rendered from it, so the
 * switch has to go through the server — `router.refresh()` re-renders the
 * tree with the new language rather than swapping strings on the client.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    router.refresh();
  }

  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs text-muted-2">
        <Languages className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="sr-only">{t.footer.language}</span>
        <select
          value={locale}
          onChange={(e) => choose(e.target.value as Locale)}
          aria-label={t.footer.language}
          className="cursor-pointer rounded-[3px] border border-border-strong bg-surface px-2 py-1 text-xs text-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
