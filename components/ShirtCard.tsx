"use client";

import { Shirt as ShirtIcon, Eye } from "lucide-react";
import type { Shirt } from "@/lib/types";
import { VERSION_BADGE, placeholderGradient } from "@/lib/shirt-helpers";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";

interface ShirtCardProps {
  shirt: Shirt;
  onView: (shirt: Shirt) => void;
}

/**
 * A single shirt in the collection grid.
 * Signature touch: a vertical color band on the left edge (the team's color),
 * like the trim of the shirt itself.
 */
export function ShirtCard({ shirt, onView }: ShirtCardProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => onView(shirt)}
      className="group relative flex w-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface text-left transition-all duration-200 hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      {/* Team color side band */}
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-full w-1.5"
        style={{ backgroundColor: shirt.teamColor }}
      />

      {/* Image / placeholder */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {shirt.thumbUrl || shirt.imageUrl ? (
          // The grid loads the 400px thumbnail; the full image is only fetched
          // in the detail view. eslint-disable-next-line is for next/image,
          // which we skip because these are signed URLs on a private bucket.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shirt.thumbUrl ?? shirt.imageUrl}
            alt={`${shirt.team} ${shirt.season} ${shirt.version}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
              style={{ background: placeholderGradient(shirt) }}
            />
            <ShirtIcon
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white/15"
              strokeWidth={1}
            />
          </>
        )}
        {/* darkening for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

        {/* Manufacturer badge */}
        <div className="absolute right-2 top-2">
          <Badge
            variant="outline"
            className="border-white/20 bg-black/40 text-white/80 backdrop-blur-sm"
          >
            {shirt.manufacturer}
          </Badge>
        </div>

        {/* Version badge */}
        <div className="absolute bottom-2 left-3">
          <span
            className={cn(
              "inline-flex items-center rounded-[3px] border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide leading-none backdrop-blur-sm",
              VERSION_BADGE[shirt.version],
            )}
          >
            {shirt.version}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-semibold text-bg">
            <Eye className="h-4 w-4" />
            {t.card.view}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 px-4 pb-4 pt-3">
        <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-white">
          {shirt.team}
        </h3>
        <p className="text-sm font-medium text-accent">{shirt.season}</p>
        <p className="mt-0.5 text-xs text-muted">
          {[shirt.country, shirt.league].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>
    </button>
  );
}
