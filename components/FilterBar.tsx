"use client";

import { Search, X } from "lucide-react";
import type {
  Country,
  League,
  ShirtFilters,
  ShirtVersion,
} from "@/lib/types";
import { COUNTRIES, LEAGUES, VERSIONS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  filters: ShirtFilters;
  onChange: (patch: Partial<ShirtFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  /** Seasons present in the current collection, for the season dropdown. */
  seasons: string[];
}

/** Real-time, client-side filter controls for the collection. */
export function FilterBar({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  seasons,
}: FilterBarProps) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1 lg:min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by team…"
            className="pl-9"
            aria-label="Search by team"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-1">
          <Select
            aria-label="Filter by country"
            value={filters.country}
            onChange={(e) =>
              onChange({ country: e.target.value as Country | "all" })
            }
          >
            <option value="all">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by league"
            value={filters.league}
            onChange={(e) =>
              onChange({ league: e.target.value as League | "all" })
            }
          >
            <option value="all">All leagues</option>
            {LEAGUES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by season"
            value={filters.season}
            onChange={(e) => onChange({ season: e.target.value })}
          >
            <option value="all">All seasons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by version"
            value={filters.version}
            onChange={(e) =>
              onChange({ version: e.target.value as ShirtVersion | "all" })
            }
          >
            <option value="all">All versions</option>
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
          Reset
        </Button>
      </div>
    </div>
  );
}
