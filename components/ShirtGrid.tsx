"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, SearchX, Loader2, AlertCircle, Shirt as ShirtIcon } from "lucide-react";
import type { Shirt, ShirtFilters, ShirtFormData } from "@/lib/types";
import {
  createShirt,
  updateShirt,
  deleteShirt,
} from "@/app/collection/actions";
import { StatsBar } from "@/components/StatsBar";
import { FilterBar } from "@/components/FilterBar";
import { ShirtCard } from "@/components/ShirtCard";
import { AddShirtModal, type SaveMeta } from "@/components/AddShirtModal";
import { ShirtDetailModal } from "@/components/ShirtDetailModal";
import { Button } from "@/components/ui/button";

interface ShirtGridProps {
  /** Shirts fetched on the server for the signed-in user. */
  initialShirts: Shirt[];
}

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
 * Stateful controller for the collection. Server-fetched shirts arrive as
 * props; mutations go through Server Actions and are applied optimistically,
 * then reconciled when the server sends fresh props after revalidation.
 */
export function ShirtGrid({ initialShirts }: ShirtGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  // Local optimistic copy, re-synced whenever the server sends new props.
  const [shirts, setShirts] = React.useState<Shirt[]>(initialShirts);
  const [syncedProps, setSyncedProps] = React.useState<Shirt[]>(initialShirts);
  if (initialShirts !== syncedProps) {
    setSyncedProps(initialShirts);
    setShirts(initialShirts);
  }

  const [filters, setFilters] = React.useState<ShirtFilters>(DEFAULT_FILTERS);
  const [error, setError] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState<Shirt | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Shirt | null>(null);

  // Seasons available in the collection, newest first — drives the dropdown.
  const seasons = React.useMemo(
    () =>
      Array.from(new Set(shirts.map((s) => s.season))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [shirts],
  );

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.country !== "all" ||
    filters.league !== "all" ||
    filters.season !== "all" ||
    filters.version !== "all";

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
    setDetailOpen(false);
    setSelected(null);
    // Optimistic removal, then persist.
    setShirts((prev) => prev.filter((s) => s.id !== shirt.id));
    startTransition(async () => {
      const res = await deleteShirt(shirt.id);
      if (res.error) {
        setError(res.error);
        setShirts(syncedProps); // revert
      }
      router.refresh();
    });
  };

  const handleSave = (data: ShirtFormData, meta: SaveMeta) => {
    setError(null);
    if (meta.id) {
      const id = meta.id;
      // Optimistic edit
      setShirts((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                ...data,
                imageUrl: meta.previewUrl ?? s.imageUrl,
                ai: {
                  ...s.ai,
                  label: `${data.team} ${data.version} ${data.season}`,
                },
              }
            : s,
        ),
      );
      startTransition(async () => {
        const res = await updateShirt(id, data, meta.imagePath);
        if (res.error) setError(res.error);
        router.refresh();
      });
    } else {
      // Optimistic add with a temporary id + color that the action reuses.
      const color =
        NEW_SHIRT_COLORS[Math.floor(Math.random() * NEW_SHIRT_COLORS.length)];
      const tempShirt: Shirt = {
        id: `temp-${Date.now()}`,
        ...data,
        teamColor: color,
        imagePath: meta.imagePath ?? undefined,
        imageUrl: meta.previewUrl,
        ai: {
          label: `${data.team} ${data.version} ${data.season}`,
          confidence: 80,
        },
        addedAt: new Date().toISOString().slice(0, 10),
      };
      setShirts((prev) => [tempShirt, ...prev]);
      startTransition(async () => {
        const res = await createShirt(data, color, meta.imagePath);
        if (res.error) setError(res.error);
        router.refresh();
      });
    }
  };

  const isEmpty = shirts.length === 0;

  return (
    <div className="space-y-6">
      <StatsBar shirts={shirts} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Your collection
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            )}
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

      {error && (
        <div className="flex items-center gap-2 rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!isEmpty && (
        <FilterBar
          filters={filters}
          onChange={patchFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          hasActiveFilters={hasActiveFilters}
          seasons={seasons}
        />
      )}

      {/* Grid / empty states */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <ShirtIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Your vault is empty
            </p>
            <p className="mt-1 text-sm text-muted">
              Add your first shirt to get started.
            </p>
          </div>
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" />
            Add shirt
          </Button>
        </div>
      ) : filtered.length > 0 ? (
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
