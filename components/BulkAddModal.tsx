"use client";

import * as React from "react";
import {
  UploadCloud,
  Sparkles,
  Loader2,
  Info,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Minimize2,
} from "lucide-react";
import { useQuota } from "@/components/QuotaProvider";
import { MAX_FILES, useBulkJob } from "@/components/BulkJobProvider";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShirtFields } from "@/components/ShirtFields";
import { fill, plural } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

/**
 * The review dialog for a bulk batch. It owns no work: the batch lives in
 * `BulkJobProvider`, so closing this only hides it.
 */
export function BulkAddModal() {
  const { t } = useI18n();
  const { quota } = useQuota();
  const job = useBulkJob();
  const [dragging, setDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const item = job.items[job.current];
  const analyzing = job.status === "analyzing";
  const saving = job.status === "saving";

  return (
    <Dialog open={job.open} onOpenChange={job.setOpen} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{t.bulk.title}</DialogTitle>
        <DialogDescription>
          {analyzing
            ? t.bulk.descBackground
            : job.items.length > 0
              ? fill(t.bulk.descReview, {
                  current: job.current + 1,
                  total: job.items.length,
                })
              : t.bulk.descPick}
        </DialogDescription>
      </DialogHeader>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => job.start(Array.from(e.target.files ?? []))}
      />

      {/* Pick */}
      {job.status === "idle" && (
        <div className="p-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              job.start(Array.from(e.dataTransfer.files ?? []));
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius)] border-2 border-dashed px-6 py-14 text-center transition-colors ${
              dragging
                ? "border-accent bg-accent-soft"
                : "border-border-strong bg-surface-2 hover:border-muted-2"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="font-medium text-ink">
                {fill(t.bulk.dropTitle, { max: MAX_FILES })}
              </p>
              <p className="mt-1 text-sm text-muted">{t.bulk.dropBody}</p>
            </div>
          </div>
          {quota && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-2">
              <Sparkles className="h-3.5 w-3.5" />
              {fill(t.bulk.quotaLeft, { remaining: quota.remaining })}
            </p>
          )}
          {job.error && (
            <p className="mt-3 text-center text-xs text-danger">{job.error}</p>
          )}
        </div>
      )}

      {/* Analysing */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <Sparkles className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              {fill(t.bulk.analyzing, {
                current: Math.min(job.progress.done + 1, job.progress.total),
                total: job.progress.total,
              })}
            </p>
            <p className="mt-1 text-sm text-muted">{t.bulk.analyzingBody}</p>
          </div>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{
                width: `${
                  job.progress.total
                    ? (job.progress.done / job.progress.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => job.setOpen(false)}
            >
              <Minimize2 className="h-4 w-4" />
              {t.bulk.keepWorking}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={job.discard}
              className="text-danger hover:text-danger"
            >
              {t.bulk.cancelBatch}
            </Button>
          </div>
        </div>
      )}

      {/* Review */}
      {!analyzing && job.items.length > 0 && item && (
        <>
          {/* Filmstrip */}
          <div className="flex gap-2 overflow-x-auto border-b border-border px-6 py-3">
            {job.items.map((entry, index) => {
              const ready = entry.form.team.trim() && entry.form.season.trim();
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => job.setCurrent(index)}
                  title={
                    entry.form.team ||
                    fill(t.bulk.photoLabel, { number: index + 1 })
                  }
                  className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-[3px] border-2 transition-colors ${
                    index === job.current
                      ? "border-accent"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-tl-[3px] ${
                      ready ? "bg-accent text-bg" : "bg-warning text-bg"
                    }`}
                  >
                    {ready ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="max-h-[52vh] space-y-4 overflow-y-auto p-6">
            <div className="flex items-start gap-4">
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-[var(--radius)] border border-border bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                {item.aiError ? (
                  <p className="flex items-start gap-2 rounded-[var(--radius)] border border-warning/40 bg-warning-soft p-2.5 text-xs leading-relaxed text-warning">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {item.aiError}
                  </p>
                ) : (
                  item.confidence !== null && (
                    <p className="flex items-start gap-2 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-2.5 text-xs leading-relaxed text-accent">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {fill(t.addShirt.aiSuggested, {
                        confidence: item.confidence,
                      })}
                    </p>
                  )
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => job.removeItem(job.current)}
                  disabled={saving}
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.bulk.removePhoto}
                </Button>
              </div>
            </div>

            <ShirtFields
              key={item.id}
              value={item.form}
              onChange={(key, value) => job.updateItem(job.current, key, value)}
              idPrefix={`bulk-${item.id}`}
              showNotes={false}
            />

            {job.error && (
              <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
                {job.error}
              </p>
            )}
          </div>

          <DialogFooter>
            <div className="mr-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => job.setCurrent(Math.max(0, job.current - 1))}
                disabled={job.current === 0 || saving}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  job.setCurrent(
                    Math.min(job.items.length - 1, job.current + 1),
                  )
                }
                disabled={job.current >= job.items.length - 1 || saving}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => job.setOpen(false)}
              disabled={saving}
            >
              {t.bulk.later}
            </Button>
            <Button
              type="button"
              onClick={job.saveAll}
              disabled={saving || job.incomplete > 0}
              title={
                job.incomplete > 0
                  ? fill(t.bulk.incomplete, { count: job.incomplete })
                  : undefined
              }
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {plural(t.bulk.save, job.items.length)}
            </Button>
          </DialogFooter>
        </>
      )}

      {/* Everything was removed during review. */}
      {!analyzing && job.status !== "idle" && job.items.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm text-muted">{t.bulk.emptyBatch}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={job.discard}
          >
            {t.bulk.startOver}
          </Button>
        </div>
      )}
    </Dialog>
  );
}
