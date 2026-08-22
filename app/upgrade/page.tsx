import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchCollectionLimit } from "@/lib/quota";
import { fetchPlans } from "@/lib/plans";
import { Brand } from "@/components/Brand";
import { Pricing } from "@/components/landing/Pricing";
import { UpgradeInterest } from "@/components/UpgradeInterest";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Upgrade to Pro — KitVault",
};

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/upgrade");

  const [limit, plans] = await Promise.all([
    fetchCollectionLimit(supabase),
    fetchPlans(),
  ]);

  const isPro = limit !== null && limit.plan !== "free";

  // `upgrade_interest` is keyed by user and readable only by its owner, so a
  // row here means this user already asked.
  const { data: interest } = await supabase
    .from("upgrade_interest")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand href="/collection" />
          <Link href="/collection">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to my collection
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {isPro ? (
          <section className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Crown className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
              You&apos;re on Pro
            </h1>
            <p className="mt-3 text-muted">
              Unlimited shirts, bulk upload and the highest AI allowance. There
              is nothing else to buy.
            </p>
            <Link href="/collection" className="mt-6 inline-block">
              <Button size="lg">Back to my collection</Button>
            </Link>
          </section>
        ) : (
          <>
            <section className="mx-auto w-full max-w-2xl px-4 pt-16 text-center sm:px-6">
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
                Room for every shirt
              </h1>
              <p className="mt-3 text-muted">
                You&apos;re on the free plan
                {limit?.maxShirts != null && (
                  <>
                    {" "}
                    — <span className="text-ink">{limit.used}</span> of{" "}
                    {limit.maxShirts} shirts used
                  </>
                )}
                .
              </p>
            </section>

            <Pricing plans={plans} />

            <section className="mx-auto w-full max-w-md px-4 pb-20 sm:px-6">
              {/* Honest about the state of things: the plan exists, the
                  checkout does not yet. */}
              <div className="rounded-[var(--radius)] border border-border bg-surface p-6">
                <p className="mb-4 text-center text-sm text-muted">
                  Payments aren&apos;t open yet. Put your name down and
                  you&apos;ll be first to know.
                </p>
                <UpgradeInterest alreadyOnList={Boolean(interest)} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
