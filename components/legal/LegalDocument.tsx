import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { fill } from "@/lib/i18n/format";
import type { Messages } from "@/lib/i18n/messages/en";
import type { Locale } from "@/lib/i18n/config";
import { LEGAL, LEGAL_VARS } from "@/lib/legal/config";
import type { LegalDoc } from "@/lib/legal/documents";

interface LegalDocumentProps {
  doc: LegalDoc;
  locale: Locale;
  t: Messages;
  /** The other document, linked at the foot of this one. */
  other: { href: string; label: string };
}

/**
 * True when the text uses a placeholder whose value is empty — such a line
 * ("NIF: ") says nothing, so it is dropped rather than rendered blank.
 */
function usesEmptyValue(text: string): boolean {
  return [...text.matchAll(/\{(\w+)\}/g)].some(
    ([, key]) => key in LEGAL_VARS && LEGAL_VARS[key].trim() === "",
  );
}

/** A long-form legal page: plain, readable, and the same in both languages. */
export function LegalDocument({ doc, locale, t, other }: LegalDocumentProps) {
  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(`${LEGAL.updated}T00:00:00Z`));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <LocaleSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.legal.back}
        </Link>

        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-muted-2">
          {fill(t.legal.updated, { date: updated })}
        </p>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
          {doc.intro}
        </p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 max-w-prose text-[15px] leading-relaxed text-muted">
                {section.blocks.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i} className="list-disc space-y-2 pl-5 marker:text-accent">
                      {block
                        .filter((item) => !usesEmptyValue(item))
                        .map((item) => (
                          <li key={item}>{fill(item, LEGAL_VARS)}</li>
                        ))}
                    </ul>
                  ) : (
                    <p key={i}>{fill(block, LEGAL_VARS)}</p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-6 text-sm">
          <Link href={other.href} className="text-accent hover:underline">
            {other.label} →
          </Link>
        </div>
      </main>
    </div>
  );
}
