import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS } from "@/lib/legal/documents";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();
  return { title: `${TERMS[locale].title} — KitVault` };
}

export default async function TermsPage() {
  const { locale, t } = await getTranslations();
  return (
    <LegalDocument
      doc={TERMS[locale]}
      locale={locale}
      t={t}
      other={{ href: "/privacy", label: t.legal.privacy }}
    />
  );
}
