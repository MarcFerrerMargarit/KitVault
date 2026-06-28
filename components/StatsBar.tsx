import { Shirt as ShirtIcon, Globe2, Trophy, Clock } from "lucide-react";
import type { Shirt } from "@/lib/types";

interface StatsBarProps {
  shirts: Shirt[];
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Derives headline numbers from the whole collection. */
export function StatsBar({ shirts }: StatsBarProps) {
  const countries = new Set(shirts.map((s) => s.country)).size;
  const leagues = new Set(shirts.map((s) => s.league)).size;

  const latest = [...shirts].sort(
    (a, b) => +new Date(b.addedAt) - +new Date(a.addedAt),
  )[0];

  const stats: Stat[] = [
    { label: "Shirts", value: String(shirts.length), icon: ShirtIcon },
    { label: "Countries", value: String(countries), icon: Globe2 },
    { label: "Leagues", value: String(leagues), icon: Trophy },
    {
      label: "Last added",
      value: latest ? latest.team : "—",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-4 py-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-accent-soft text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {stat.label}
              </p>
              <p className="truncate font-display text-lg font-bold leading-tight text-white">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
