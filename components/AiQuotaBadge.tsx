"use client";

import { Sparkles } from "lucide-react";
import { useQuota } from "@/components/QuotaProvider";
import { cn } from "@/lib/utils";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

/**
 * Always-visible counter of AI identifications left today. Hidden entirely
 * when the quota cannot be read, so a missing migration never breaks the page.
 */
export function AiQuotaBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  const { quota } = useQuota();
  if (!quota) return null;

  const { remaining, userLimit } = quota;
  const empty = remaining === 0;
  const low = !empty && remaining <= 1;

  const resets = new Date(quota.resetsAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const title = empty
    ? fill(t.quota.tooltipEmpty, { time: resets })
    : fill(t.quota.tooltip, {
        remaining,
        limit: userLimit,
        plan: quota.plan,
        time: resets,
      });

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none",
        empty
          ? "border-danger/40 bg-danger-soft text-danger"
          : low
            ? "border-warning/40 bg-warning-soft text-warning"
            : "border-accent/40 bg-accent-soft text-accent",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0" />
      <span>
        {remaining}
        <span className="text-muted-2">/{userLimit}</span>
      </span>
      <span className="hidden sm:inline">{t.quota.left}</span>
    </span>
  );
}
