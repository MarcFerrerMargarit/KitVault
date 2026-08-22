"use client";

import * as React from "react";
import { BellRing, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * Records that a user wants the paid plan.
 *
 * Payments are not wired up yet. Rather than a button that does nothing, this
 * puts them on a list — which is also the only honest way to find out whether
 * the paid plan is worth building the billing for.
 */
export function UpgradeInterest({ alreadyOnList }: { alreadyOnList: boolean }) {
  const [done, setDone] = React.useState(alreadyOnList);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You are not signed in.");
      setLoading(false);
      return;
    }

    // Upsert: the table is keyed by user, so asking twice is harmless.
    const { error } = await supabase
      .from("upgrade_interest")
      .upsert({ user_id: user.id, plan: "pro" }, { onConflict: "user_id" });

    if (error) setError(error.message);
    else setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius)] border border-accent/40 bg-accent-soft p-4 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Check className="h-4 w-4" />
        </div>
        <p className="font-display text-sm font-bold uppercase tracking-wide text-accent">
          You&apos;re on the list
        </p>
        <p className="text-xs text-muted">
          We&apos;ll email you the moment Pro can be paid for. Nothing is
          charged until then.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Button size="lg" onClick={handleClick} disabled={loading}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <BellRing className="h-5 w-5" />
        )}
        Notify me when Pro is available
      </Button>
      <p className="text-xs text-muted-2">
        No card, no charge — just a heads-up when payments open.
      </p>
      {error && (
        <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
