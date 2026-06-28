import { Shirt as ShirtIcon } from "lucide-react";
import type { Shirt } from "@/lib/types";
import { MOCK_SHIRTS } from "@/lib/mock-data";
import { VERSION_BADGE, placeholderGradient } from "@/lib/shirt-helpers";
import { cn } from "@/lib/utils";

/** A single small kit tile used inside the scrolling wall. */
function KitTile({ shirt }: { shirt: Shirt }) {
  return (
    <div className="relative w-[150px] shrink-0 overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-full w-1"
        style={{ backgroundColor: shirt.teamColor }}
      />
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: placeholderGradient(shirt) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
        <ShirtIcon
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/15"
          strokeWidth={1}
        />
        <span
          className={cn(
            "absolute bottom-1.5 left-2 inline-flex items-center rounded-[3px] border px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none backdrop-blur-sm",
            VERSION_BADGE[shirt.version],
          )}
        >
          {shirt.version}
        </span>
      </div>
      <div className="px-2.5 py-2">
        <p className="truncate font-display text-sm font-bold uppercase leading-tight tracking-wide text-white">
          {shirt.team}
        </p>
        <p className="text-[11px] text-accent">{shirt.season}</p>
      </div>
    </div>
  );
}

function Row({
  shirts,
  reverse,
  duration,
}: {
  shirts: Shirt[];
  reverse?: boolean;
  duration: string;
}) {
  // Duplicate the list so the loop is seamless (track scrolls exactly 50%).
  const items = [...shirts, ...shirts];
  return (
    <div
      className={cn(
        "flex w-max gap-3",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
        "group-hover:[animation-play-state:paused]",
      )}
      style={{ ["--dur" as string]: duration }}
    >
      {items.map((shirt, i) => (
        <KitTile key={`${shirt.id}-${i}`} shirt={shirt} />
      ))}
    </div>
  );
}

/**
 * An infinite, two-row "kit wall" that scrolls in opposite directions —
 * a stadium-board feel that also previews the real collection data.
 * Pauses on hover. Pure CSS, no client JS.
 */
export function KitMarquee() {
  const top = MOCK_SHIRTS.slice(0, 7);
  const bottom = MOCK_SHIRTS.slice(7);

  return (
    <div className="group relative overflow-hidden py-2">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

      <div className="space-y-3">
        <Row shirts={top} duration="46s" />
        <Row shirts={bottom} reverse duration="56s" />
      </div>
    </div>
  );
}
