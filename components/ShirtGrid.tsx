"use client";

import * as React from "react";
import { Plus, SearchX } from "lucide-react";
import type { Shirt, ShirtFilters, ShirtFormData } from "@/lib/types";
import { MOCK_SHIRTS } from "@/lib/mock-data";
import { StatsBar } from "@/components/StatsBar";
import { FilterBar } from "@/components/FilterBar";
import { ShirtCard } from "@/components/ShirtCard";
import { AddShirtModal } from "@/components/AddShirtModal";
import { ShirtDetailModal } from "@/components/ShirtDetailModal";
import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS: ShirtFilters = {
  search: "",
  country: "all",
  league: "all",
  season: "all",
  version: "all",
};

// Palette used to give freshly added shirts a side-band color.
const NEW_SHIRT_COLORS = [
  "#4ade80",
  "#60a5fa",
  "#c084fc",
  "#f97316",
  "#ef4444",
  "#14b8a6",
  "#eab308",
];

/**
 * Stateful controller for the collection: holds the (mock) shirt list, runs
 * client-side filtering, and orchestrates the add / detail / edit modals.
 */
export function ShirtGrid() {
  const [shirts, setShirts] = React.useState<Shirt[]>(MOCK_SHIRTS);
  const [filters, setFilters] = React.useState<ShirtFilters>(DEFAULT_FILTERS);

  const [selected, setSelected] = React.useState<Shirt | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Shirt | null>(null);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.country !== "all" ||
    filters.league !== "all" ||
    filters.season !== "all" ||
    filters.version !== "all";

  // Real-time, client-side filtering over the mock data.
  const filtered = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return shirts.filter((s) => {
      if (q && !s.team.toLowerCase().includes(q)) return false;
      if (filters.country !== "all" && s.country !== filters.country)
        return false;
      if (filters.league !== "all" && s.league !== filters.league) return false;
      if (filters.season !== "all" && s.season !== filters.season) return false;
      if (filters.version !== "all" && s.version !== filters.version)
        return false;
      return true;
    });
  }, [shirts, filters]);

  const patchFilters = (patch: Partial<ShirtFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleView = (shirt: Shirt) => {
    setSelected(shirt);
    setDetailOpen(true);
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setAddOpen(true);
  };

  const handleEdit = (shirt: Shirt) => {
    setDetailOpen(false);
    setEditing(shirt);
    setAddOpen(true);
  };

  const handleDelete = (shirt: Shirt) => {
    setShirts((prev) => prev.filter((s) => s.id !== shirt.id));
    setDetailOpen(false);
    setSelected(null);
  };

  const handleSave = (data: ShirtFormData, id?: string) => {
    if (id) {
      // Edit existing
      setShirts((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                ...data,
                ai: { ...s.ai, label: `${data.team} ${data.version} ${data.season}` },
              }
            : s,
        ),
      );
    } else {
      // Add new
      const color =
        NEW_SHIRT_COLORS[Math.floor(Math.random() * NEW_SHIRT_COLORS.length)];
      const newShirt: Shirt = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `shirt-${Date.now()}`,
        ...data,
        teamColor: color,
        ai: {
          label: `${data.team} ${data.version} ${data.season}`,
          confidence: 80,
        },
        addedAt: new Date().toISOString().slice(0, 10),
      };
      setShirts((prev) => [newShirt, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      <StatsBar shirts={shirts} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Your collection
          </h1>
          <p className="text-sm text-muted">
            {filtered.length} of {shirts.length} shirts
            {hasActiveFilters ? " match your filters" : ""}
          </p>
        </div>
        <Button size="lg" onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add shirt</span>
        </Button>
      </div>

      <FilterBar
        filters={filters}
        onChange={patchFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((shirt) => (
            <ShirtCard key={shirt.id} shirt={shirt} onView={handleView} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
            <SearchX className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              No shirts found
            </p>
            <p className="mt-1 text-sm text-muted">
              Try adjusting or resetting your filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddShirtModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
        editingShirt={editing}
      />
      <ShirtDetailModal
        shirt={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
