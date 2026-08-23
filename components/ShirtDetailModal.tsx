"use client";

import {
  Shirt as ShirtIcon,
  Sparkles,
  Pencil,
  Trash2,
  MapPin,
  Trophy,
  Calendar,
  Tag,
} from "lucide-react";
import type { Shirt } from "@/lib/types";
import {
  VERSION_BADGE,
  placeholderGradient,
  confidenceTone,
} from "@/lib/shirt-helpers";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

interface ShirtDetailModalProps {
  shirt: Shirt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (shirt: Shirt) => void;
  onDelete: (shirt: Shirt) => void;
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-4 w-4 text-muted-2" />
        {label}
      </span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

/** Large detail view for a single shirt. */
export function ShirtDetailModal({
  shirt,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ShirtDetailModalProps) {
  const { t } = useI18n();
  if (!shirt) return null;

  const tone = confidenceTone(shirt.ai.confidence);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl">
      <div className="grid gap-0 sm:grid-cols-[300px_1fr]">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-auto sm:rounded-l-[var(--radius)]">
          <span
            aria-hidden
            className="absolute left-0 top-0 z-10 h-full w-2"
            style={{ backgroundColor: shirt.teamColor }}
          />
          {shirt.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shirt.imageUrl}
              alt={`${shirt.team} ${shirt.season} ${shirt.version}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{ background: placeholderGradient(shirt) }}
              />
              <ShirtIcon
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-white/20"
                strokeWidth={1}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
          <span
            className={cn(
              "absolute bottom-3 left-4 inline-flex items-center rounded-[3px] border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide leading-none backdrop-blur-sm",
              VERSION_BADGE[shirt.version],
            )}
          >
            {shirt.version}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 pt-12 sm:pt-6">
          <p className="text-sm font-medium text-accent">{shirt.season}</p>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-white">
            {shirt.team}
          </h2>

          <div className="mt-4">
            <MetaRow
              icon={Calendar}
              label={t.detail.season}
              value={shirt.season}
            />
            <MetaRow
              icon={Tag}
              label={t.detail.version}
              value={shirt.version}
            />
            <MetaRow
              icon={MapPin}
              label={t.detail.country}
              value={shirt.country || "—"}
            />
            <MetaRow
              icon={Trophy}
              label={t.detail.league}
              value={shirt.league || "—"}
            />
            <MetaRow
              icon={Tag}
              label={t.detail.manufacturer}
              value={shirt.manufacturer || "—"}
            />
          </div>

          {shirt.notes && (
            <p className="mt-4 rounded-[var(--radius)] border border-border bg-surface-2 p-3 text-sm leading-relaxed text-muted">
              {shirt.notes}
            </p>
          )}

          {/* AI Identification */}
          <div className="mt-4 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {t.detail.aiTitle}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-ink">
              {t.detail.identifiedAs}{" "}
              <span className="font-semibold">{shirt.ai.label}</span>{" "}
              <span className={cn("font-semibold", tone.className)}>
                {fill(t.detail.confidence, { value: shirt.ai.confidence })}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onEdit(shirt)}
            >
              <Pencil className="h-4 w-4" />
              {t.detail.edit}
            </Button>
            <Button variant="danger" onClick={() => onDelete(shirt)}>
              <Trash2 className="h-4 w-4" />
              {t.detail.delete}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
