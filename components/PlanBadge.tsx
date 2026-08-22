"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

/**
 * Which plan the signed-in user is on, always visible in the header.
 *
 * For free users it doubles as the way in to upgrading; for pro users it is
 * just a label — there is nowhere better for them to go.
 */
export function PlanBadge({ plan }: { plan: string | null }) {
  if (!plan) return null;

  const isPro = plan !== "free";
  const label = plan.toUpperCase();

  const className =
    "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none transition-colors";

  if (isPro) {
    return (
      <span
        title={`You are on the ${plan} plan`}
        className={`${className} border-accent/40 bg-accent-soft text-accent`}
      >
        <Crown className="h-3.5 w-3.5 shrink-0" />
        {label}
      </span>
    );
  }

  return (
    <Link
      href="/upgrade"
      title="You are on the free plan — see what Pro adds"
      className={`${className} border-border-strong bg-surface-2 text-muted hover:border-accent/40 hover:text-accent`}
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
      <span className="hidden text-muted-2 sm:inline">· Upgrade</span>
    </Link>
  );
}
