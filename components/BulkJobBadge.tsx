"use client";

import { Loader2, Sparkles, X } from "lucide-react";
import { useBulkJob } from "@/components/BulkJobProvider";

/**
 * Floating status pill for a bulk batch running behind the review dialog.
 *
 * Without it, closing the dialog would leave a batch spending AI credits with
 * nothing on screen to show for it.
 */
export function BulkJobBadge() {
  const job = useBulkJob();

  // Nothing to report when idle, or when the dialog is already showing it all.
  if (job.status === "idle" || job.open) return null;

  const analyzing = job.status === "analyzing";
  const saving = job.status === "saving";
  const pct = job.progress.total
    ? (job.progress.done / job.progress.total) * 100
    : 0;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius)] border border-accent/40 bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      <div className="flex items-start gap-3 p-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          {analyzing || saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
            {analyzing
              ? `Analyzing ${Math.min(job.progress.done + 1, job.progress.total)} of ${job.progress.total}`
              : saving
                ? "Saving your shirts…"
                : `${job.items.length} shirt${job.items.length === 1 ? "" : "s"} ready`}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {analyzing
              ? "Carry on — this runs in the background."
              : saving
                ? "Uploading photos and saving."
                : "Review them before they join your collection."}
          </p>

          {!saving && (
            <button
              type="button"
              onClick={() => job.setOpen(true)}
              className="mt-2 text-xs font-semibold text-accent underline-offset-2 hover:underline"
            >
              {analyzing ? "Show progress" : "Review now"}
            </button>
          )}
        </div>

        {!saving && (
          <button
            type="button"
            onClick={job.discard}
            title={analyzing ? "Cancel this batch" : "Discard this batch"}
            className="-mr-1 -mt-1 shrink-0 rounded-[3px] p-1 text-muted-2 transition-colors hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {(analyzing || saving) && (
        <div className="h-1 w-full bg-surface-2">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: saving ? "100%" : `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
