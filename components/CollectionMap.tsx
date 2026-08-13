"use client";

import * as React from "react";
import { Globe2, Loader2, MapPinOff } from "lucide-react";
import type { Shirt } from "@/lib/types";
import {
  buildCountryIndex,
  matchCountry,
  type CountryIndex,
} from "@/lib/country-match";
import type { WorldMapData } from "@/lib/world-map";

interface CollectionMapProps {
  shirts: Shirt[];
  /** Click a country to see just those shirts. */
  onSelectCountry: (label: string, values: string[]) => void;
}

/** What we know about one country once the shirts are counted. */
interface CountryTally {
  id: string;
  name: string;
  count: number;
  /** The raw `shirts.country` values that landed here, most shirts first. */
  values: string[];
}

/** How many countries the ranking below the map lists. */
const TOP_COUNTRIES = 9;

/** Fill for countries you have nothing from. */
const EMPTY_FILL = "#1c1c22";

/**
 * Choropleth ramp, deep pine → grass → mint. Varying lightness and hue reads
 * far better on a dark map than varying opacity alone, which just fades
 * everything towards the background.
 */
const RAMP: ReadonlyArray<readonly [number, number, number]> = [
  [22, 101, 52], // #166534
  [74, 222, 128], // #4ade80 — the app's accent, mid-scale
  [187, 247, 208], // #bbf7d0
];

/** CSS gradient of the same ramp, so the legend can never drift from the map. */
const RAMP_GRADIENT = `linear-gradient(90deg, ${RAMP.map(
  ([r, g, b]) => `rgb(${r}, ${g}, ${b})`,
).join(", ")})`;

/** Sample the ramp at `t` ∈ [0, 1]. */
function rampColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const from = RAMP[i];
  const to = RAMP[i + 1];
  const mix = (a: number, b: number) => Math.round(a + (b - a) * f);
  return `rgb(${mix(from[0], to[0])}, ${mix(from[1], to[1])}, ${mix(from[2], to[2])})`;
}

/**
 * Where a country sits on the ramp. The scale is stretched between your
 * least- and most-collected country so the full range is always in play — with
 * a raw `count / max` a collection of 1s and 2s would be three shades of the
 * same dark green. The square root then keeps one dominant country from
 * flattening the rest onto the floor.
 */
function rampPosition(count: number, max: number): number {
  if (max <= 1) return 0.5;
  return Math.sqrt((count - 1) / (max - 1));
}

/** Geometry is fetched once and reused for the rest of the session. */
let mapCache: WorldMapData | null = null;

export function CollectionMap({ shirts, onSelectCountry }: CollectionMapProps) {
  const [world, setWorld] = React.useState<WorldMapData | null>(mapCache);
  const [failed, setFailed] = React.useState(false);
  const [hovered, setHovered] = React.useState<CountryTally | null>(null);

  React.useEffect(() => {
    if (mapCache) return;
    let active = true;
    fetch("/api/world-map")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load the map");
        return res.json();
      })
      .then((data: WorldMapData) => {
        mapCache = data;
        if (active) setWorld(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const index: CountryIndex | null = React.useMemo(
    () => (world ? buildCountryIndex(world.countries) : null),
    [world],
  );

  // Count shirts per map country, and keep the ones we could not place.
  const { tallies, ranked, unplaced, max } = React.useMemo(() => {
    const byId = new Map<string, Map<string, number>>();
    const missing = new Map<string, number>();

    for (const shirt of shirts) {
      const raw = shirt.country?.trim();
      if (!raw) continue;
      const id = index ? matchCountry(raw, index) : null;
      if (!id) {
        missing.set(raw, (missing.get(raw) ?? 0) + 1);
        continue;
      }
      const bucket = byId.get(id) ?? new Map<string, number>();
      bucket.set(raw, (bucket.get(raw) ?? 0) + 1);
      byId.set(id, bucket);
    }

    const nameById = new Map(world?.countries.map((c) => [c.id, c.name]) ?? []);
    const list: CountryTally[] = [];
    for (const [id, bucket] of byId) {
      const values = [...bucket.entries()].sort((a, b) => b[1] - a[1]);
      list.push({
        id,
        name: nameById.get(id) ?? id,
        count: values.reduce((sum, [, n]) => sum + n, 0),
        values: values.map(([value]) => value),
      });
    }
    list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return {
      tallies: new Map(list.map((t) => [t.id, t])),
      ranked: list,
      unplaced: [...missing.entries()].sort((a, b) => b[1] - a[1]),
      max: list[0]?.count ?? 0,
    };
  }, [shirts, index, world]);

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface py-20 text-center">
        <MapPinOff className="h-7 w-7 text-muted-2" />
        <p className="text-sm text-muted">
          The map could not be loaded. Your shirts are all still in the grid.
        </p>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-border bg-surface py-24 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
        <p className="text-sm text-muted">Unrolling the world…</p>
      </div>
    );
  }

  const placed = ranked.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
        {/* Map */}
        <svg
          viewBox={`0 0 ${world.width} ${world.height}`}
          className="block h-auto w-full"
          role="img"
          aria-label="World map of your collection"
        >
          <defs>
            <radialGradient id="kv-ocean" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="#15151b" />
              <stop offset="100%" stopColor="#0d0d0f" />
            </radialGradient>
          </defs>
          <rect
            width={world.width}
            height={world.height}
            fill="url(#kv-ocean)"
          />

          {world.countries.map((country) => {
            const tally = tallies.get(country.id);
            const isHovered = hovered?.id === country.id;

            return (
              <path
                key={country.id}
                d={country.d}
                fill={
                  tally ? rampColor(rampPosition(tally.count, max)) : EMPTY_FILL
                }
                stroke={isHovered ? "#4ade80" : "#2a2a33"}
                strokeWidth={isHovered ? 1.2 : 0.4}
                className={
                  tally
                    ? "cursor-pointer outline-none transition-[stroke,filter] focus-visible:stroke-accent"
                    : "transition-[stroke]"
                }
                style={
                  isHovered && tally
                    ? { filter: "drop-shadow(0 0 6px rgba(74,222,128,0.55))" }
                    : undefined
                }
                tabIndex={tally ? 0 : undefined}
                role={tally ? "button" : undefined}
                aria-label={
                  tally
                    ? `${tally.name}: ${tally.count} ${tally.count === 1 ? "shirt" : "shirts"}`
                    : undefined
                }
                onMouseEnter={() => tally && setHovered(tally)}
                onMouseLeave={() =>
                  setHovered((h) => (h?.id === country.id ? null : h))
                }
                onFocus={() => tally && setHovered(tally)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  tally && onSelectCountry(tally.name, tally.values)
                }
                onKeyDown={(e) => {
                  if (tally && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectCountry(tally.name, tally.values);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Readout + legend. They float over the map from `sm` up, where the
            oceans leave room; on a phone the map is only ~180px tall, so they
            drop into a bar underneath instead of burying half of Europe. */}
        <div className="pointer-events-none flex items-center justify-between gap-2 border-t border-border p-2 sm:absolute sm:inset-0 sm:block sm:border-0 sm:p-0">
          <div className="min-w-0 sm:absolute sm:left-3 sm:top-3 sm:max-w-[60%]">
            {hovered ? (
              <div className="rounded-[var(--radius)] border border-accent/40 bg-bg/90 px-3 py-2 backdrop-blur-sm">
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                  {hovered.name}
                </p>
                <p className="text-xs text-accent">
                  {hovered.count} {hovered.count === 1 ? "shirt" : "shirts"}
                  {hovered.values.length > 1 && (
                    <span className="text-muted">
                      {" "}
                      · {hovered.values.join(", ")}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="rounded-[var(--radius)] border border-border bg-bg/80 px-3 py-2 backdrop-blur-sm">
                <p className="text-xs text-muted">
                  {placed} {placed === 1 ? "shirt" : "shirts"} across{" "}
                  {ranked.length}{" "}
                  {ranked.length === 1 ? "country" : "countries"} — click one to
                  see it
                </p>
              </div>
            )}
          </div>

          {/* Legend. Hidden when every country ties, since the ramp is then
              flat and a "1 → 1" scale would say nothing. */}
          {max > 1 && (
            <div className="flex shrink-0 items-center gap-2 rounded-[var(--radius)] border border-border bg-bg/80 px-2.5 py-1.5 backdrop-blur-sm sm:absolute sm:bottom-3 sm:right-3">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-2">
                1
              </span>
              <span
                className="h-2 w-20 rounded-full"
                style={{ background: RAMP_GRADIENT }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-2">
                {max}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-2">
                shirts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ranking */}
      {ranked.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.slice(0, TOP_COUNTRIES).map((tally) => (
            <button
              key={tally.id}
              type="button"
              onMouseEnter={() => setHovered(tally)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectCountry(tally.name, tally.values)}
              className="group flex items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-accent/50 hover:bg-surface-2"
            >
              <span className="flex-1 truncate text-sm text-ink">
                {tally.name}
              </span>
              {/* Same ramp colour as the country's fill, so the list reads as
                  a key to the map rather than a separate chart. */}
              <span className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full"
                  style={{
                    width: `${Math.max(8, (tally.count / Math.max(max, 1)) * 100)}%`,
                    backgroundColor: rampColor(rampPosition(tally.count, max)),
                  }}
                />
              </span>
              <span className="w-6 shrink-0 text-right font-display text-sm font-bold text-white">
                {tally.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* The ranking is capped, so say what it is leaving out. */}
      {ranked.length > TOP_COUNTRIES && (
        <p className="text-xs text-muted-2">
          + {ranked.length - TOP_COUNTRIES} more{" "}
          {ranked.length - TOP_COUNTRIES === 1 ? "country" : "countries"} on the
          map — hover or click them there.
        </p>
      )}

      {/* Countries with a national team but no shape at this resolution. */}
      {unplaced.length > 0 && (
        <p className="flex items-start gap-2 text-xs text-muted-2">
          <Globe2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Not on the map:{" "}
          {unplaced.map(([name, count]) => `${name} (${count})`).join(", ")}
        </p>
      )}
    </div>
  );
}
