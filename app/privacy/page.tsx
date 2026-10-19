import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY } from "@/lib/legal/documents";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();
  return { title: `${PRIVACY[locale].title} — KitVault` };
}

export default async function PrivacyPage() {
  const { locale, t } = await getTranslations();
  return (
    <LegalDocument
      doc={PRIVACY[locale]}
      locale={locale}
      t={t}
      other={{ href: "/terms", label: t.legal.terms }}
    />
  );
}
