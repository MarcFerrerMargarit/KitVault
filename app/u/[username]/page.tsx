import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVault } from "@/lib/public-vault";
import { getTranslations } from "@/lib/i18n/server";
import { fill } from "@/lib/i18n/format";
import { PublicVault } from "@/components/public/PublicVault";

interface Params {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const [vault, { t }] = await Promise.all([
    fetchPublicVault(username),
    getTranslations(),
  ]);
  if (!vault) return { title: "KitVault", robots: { index: false } };

  const name = vault.displayName || `@${vault.username}`;
  const title = fill(t.publicVault.metaTitle, { name });
  const description = fill(t.publicVault.metaDescription, {
    count: vault.stats.shirts,
    countries: vault.stats.countries,
  });

  return {
    title: `${title} · KitVault`,
    description,
    // Shared by link, not found by search: owners opted in to the first, not
    // necessarily to the second. Flip this to let search engines in.
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "profile", siteName: "KitVault" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicVaultPage({ params }: Params) {
  const { username } = await params;
  const [vault, { locale }] = await Promise.all([
    fetchPublicVault(username),
    getTranslations(),
  ]);
  // Unknown and private look the same: a 404, never "this vault is private".
  if (!vault) notFound();

  const memberSince = vault.createdAt
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        new Date(vault.createdAt),
      )
    : null;

  return <PublicVault vault={vault} memberSince={memberSince} />;
}
