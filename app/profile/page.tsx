import Link from "next/link";
import { redirect } from "next/navigation";
import { Globe2, Lock, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchCollectionLimit, fetchQuota } from "@/lib/quota";
import { fetchProfile, vaultPath } from "@/lib/profile";
import { topDistinct } from "@/lib/identify-prompt";
import { getTranslations } from "@/lib/i18n/server";
import { CollectionHeader } from "@/components/CollectionHeader";
import { QuotaProvider } from "@/components/QuotaProvider";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountSection } from "@/components/profile/AccountSection";
import { SharingSection } from "@/components/profile/SharingSection";

export async function generateMetadata() {
  const { t } = await getTranslations();
  return { title: `${t.profile.title} — KitVault` };
}

/** A titled panel; the page is a short stack of these. */
function Panel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius)] border border-border bg-surface p-5 sm:p-6">
      {title && (
        <h2 className="mb-5 font-display text-lg font-semibold uppercase tracking-wide text-ink">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const [{ t, locale }, profile, quota, collectionLimit, shirts] =
    await Promise.all([
      getTranslations(),
      fetchProfile(supabase, user.id),
      fetchQuota(supabase),
      fetchCollectionLimit(supabase),
      supabase
        .from("shirts")
        .select("team, country")
        .eq("user_id", user.id)
        .limit(5000),
    ]);

  const rows = (shirts.data ?? []) as { team: string; country: string | null }[];
  const teams = topDistinct(rows.map((r) => r.team));
  const countries = new Set(
    rows.map((r) => r.country?.trim().toLowerCase()).filter(Boolean),
  ).size;
  const plan = collectionLimit?.plan ?? null;
  const memberSince = profile.createdAt
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        new Date(profile.createdAt),
      )
    : "—";

  const stats: [string, string][] = [
    [t.stats.shirts, String(rows.length)],
    [t.stats.countries, String(countries)],
    [t.profile.memberSince, memberSince],
    [t.profile.plan, plan ? plan.toUpperCase() : "—"],
  ];

  return (
    <QuotaProvider initial={quota}>
      <div className="flex min-h-screen flex-col">
        <CollectionHeader
          email={user.email ?? "account"}
          plan={plan}
          displayName={profile.displayName}
          avatarUrl={profile.avatarUrl}
          publicUsername={profile.isPublic ? profile.username : null}
        />
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 sm:px-6">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              {t.profile.title}
            </h1>
            {/* Say who can see this, so nobody fills it in for an audience
                that does not exist — or forgets one that does. */}
            {profile.isPublic && profile.username ? (
              <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-sm text-muted">
                <Globe2 className="h-3.5 w-3.5 text-accent" />
                {t.profile.publicNote}{" "}
                <Link
                  href={vaultPath(profile.username)}
                  className="text-accent hover:underline"
                >
                  kitvault.dev{vaultPath(profile.username)}
                </Link>
              </p>
            ) : (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                <Lock className="h-3.5 w-3.5" />
                {t.profile.privateNote}
              </p>
            )}
          </div>

          <Panel>
            <ProfileForm
              userId={user.id}
              email={user.email ?? ""}
              displayName={profile.displayName}
              bio={profile.bio}
              favouriteTeam={profile.favouriteTeam}
              avatarUrl={profile.avatarUrl}
              hasAvatar={Boolean(profile.avatarPath)}
              teams={teams}
            />
          </Panel>

          <Panel title={t.sharing.title}>
            <SharingSection
              username={profile.username}
              isPublic={profile.isPublic}
            />
          </Panel>

          <Panel title={t.profile.statsTitle}>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-2">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-ink sm:text-2xl">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            {plan === "free" && (
              <Link
                href="/upgrade"
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                {t.account.upgrade}
              </Link>
            )}
          </Panel>

          <Panel title={t.profile.accountTitle}>
            <AccountSection email={user.email ?? ""} />
          </Panel>
        </main>
      </div>
    </QuotaProvider>
  );
}
