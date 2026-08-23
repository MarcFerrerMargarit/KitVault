"use client";

import { Search, X } from "lucide-react";
import type { ShirtFilters, ShirtVersion } from "@/lib/types";
import { VERSIONS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/I18nProvider";

interface FilterBarProps {
  filters: ShirtFilters;
  onChange: (patch: Partial<ShirtFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  /** Distinct values present in the collection, for the dropdowns. */
  countries: string[];
  leagues: string[];
  seasons: string[];
}

/** Real-time, client-side filter controls for the collection. */
export function FilterBar({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  countries,
  leagues,
  seasons,
}: FilterBarProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        {/* The search box takes a fixed slice and the dropdowns share the
            rest: four of them need the room, and the longest labels are the
            translated ones ("Todas las temporadas"). */}
        <div className="relative flex-1 lg:w-64 lg:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder={t.filters.search}
            className="pl-9"
            aria-label={t.filters.searchLabel}
          />
        </div>

        {/* Dropdowns. `lg:flex-1` on each select rather than on the row: the
            four share the space evenly, and `min-w-0` lets them shrink instead
            of overflowing — Spanish labels ("Todas las temporadas") are far
            longer than the English ones. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-1 lg:items-center">
          <Select
            className="min-w-0 lg:flex-1"
            aria-label={t.filters.country}
            value={filters.country}
            onChange={(e) => onChange({ country: e.target.value })}
          >
            <option value="all">{t.filters.allCountries}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            className="min-w-0 lg:flex-1"
            aria-label={t.filters.league}
            value={filters.league}
            onChange={(e) => onChange({ league: e.target.value })}
          >
            <option value="all">{t.filters.allLeagues}</option>
            {leagues.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>

          <Select
            className="min-w-0 lg:flex-1"
            aria-label={t.filters.season}
            value={filters.season}
            onChange={(e) => onChange({ season: e.target.value })}
          >
            <option value="all">{t.filters.allSeasons}</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <Select
            className="min-w-0 lg:flex-1"
            aria-label={t.filters.version}
            value={filters.version}
            onChange={(e) =>
              onChange({ version: e.target.value as ShirtVersion | "all" })
            }
          >
            <option value="all">{t.filters.allVersions}</option>
            {VERSIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="shrink-0 self-start lg:self-auto"
        >
          <X className="h-4 w-4" />
          {t.filters.reset}
        </Button>
      </div>
    </div>
  );
}
