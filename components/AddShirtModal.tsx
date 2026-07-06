"use client";

import * as React from "react";
import {
  UploadCloud,
  Sparkles,
  Loader2,
  Info,
  ImagePlus,
} from "lucide-react";
import type { Shirt, ShirtFormData } from "@/lib/types";
import {
  COUNTRIES,
  LEAGUES,
  MANUFACTURERS,
  MOCK_AI_SUGGESTIONS,
  VERSIONS,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Step = "upload" | "analyzing" | "form";

/** Extra info passed alongside the form data when saving. */
export interface SaveMeta {
  id?: string;
  /** New storage path when a photo was uploaded; `undefined` = leave unchanged. */
  imagePath?: string | null;
  /** URL to show immediately (optimistic). */
  previewUrl?: string;
}

interface AddShirtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ShirtFormData, meta: SaveMeta) => void;
  /** When set, the modal opens straight to the form in edit mode. */
  editingShirt?: Shirt | null;
}

const EMPTY_FORM: ShirtFormData = {
  team: "",
  season: "",
  version: "Home",
  country: "England",
  league: "Premier League",
  manufacturer: "Nike",
  notes: "",
};

export function AddShirtModal({
  open,
  onOpenChange,
  onSave,
  editingShirt,
}: AddShirtModalProps) {
  const isEditing = Boolean(editingShirt);
  const [step, setStep] = React.useState<Step>("upload");
  const [form, setForm] = React.useState<ShirtFormData>(EMPTY_FORM);
  const [aiConfidence, setAiConfidence] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset the flow whenever the modal transitions to open.
  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setFile(null);
      setPreviewUrl(null);
      setSaving(false);
      setError(null);
      if (editingShirt) {
        setStep("form");
        setAiConfidence(editingShirt.ai.confidence);
        setForm({
          team: editingShirt.team,
          season: editingShirt.season,
          version: editingShirt.version,
          country: editingShirt.country,
          league: editingShirt.league,
          manufacturer: editingShirt.manufacturer,
          notes: editingShirt.notes ?? "",
        });
      } else {
        setStep("upload");
        setAiConfidence(null);
        setForm(EMPTY_FORM);
      }
    }
  }

  // Simulate the AI analysis: 2s spinner, then a random pre-filled suggestion.
  const startAnalysis = React.useCallback(() => {
    setStep("analyzing");
    setTimeout(() => {
      const pick =
        MOCK_AI_SUGGESTIONS[
          Math.floor(Math.random() * MOCK_AI_SUGGESTIONS.length)
        ];
      setForm({
        team: pick.team,
        season: pick.season,
        version: pick.version,
        country: pick.country,
        league: pick.league,
        manufacturer: pick.manufacturer,
        notes: "",
      });
      setAiConfidence(pick.confidence);
      setStep("form");
    }, 2000);
  }, []);

  const selectFile = (picked: File | undefined) => {
    if (!picked || !picked.type.startsWith("image/")) return;
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(picked);
    });
    setFile(picked);
    // In the upload step, picking a photo kicks off the mock analysis.
    if (!isEditing && step === "upload") startAnalysis();
  };

  const update = <K extends keyof ShirtFormData>(
    key: K,
    value: ShirtFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.team.trim() || !form.season.trim()) return;

    setSaving(true);
    setError(null);

    let uploadedPath: string | null | undefined = undefined;

    // Upload a newly selected photo to the private `shirts` bucket.
    if (file) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You are not signed in.");
        setSaving(false);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("shirts")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setError(`Photo upload failed: ${upErr.message}`);
        setSaving(false);
        return;
      }
      uploadedPath = path;
    }

    onSave(form, {
      id: editingShirt?.id,
      imagePath: uploadedPath,
      previewUrl: previewUrl ?? editingShirt?.imageUrl,
    });
    onOpenChange(false);
  };

  const shownImage = previewUrl ?? editingShirt?.imageUrl ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit shirt" : "Add new shirt"}</DialogTitle>
        <DialogDescription>
          {step === "form"
            ? "Review the details and save to your collection."
            : "Upload a photo and let AI identify it for you."}
        </DialogDescription>
      </DialogHeader>

      {/* Hidden native file input, shared by all steps. */}
      <input
        ref={fileInputRef}
        id="photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />

      {/* Step 1 — Upload */}
      {step === "upload" && (
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
              selectFile(e.dataTransfer.files?.[0]);
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
                Drag &amp; drop a photo here
              </p>
              <p className="mt-1 text-sm text-muted">
                or click to browse — PNG, JPG up to 10MB
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI identification is mocked for now — real analysis lands in Phase 3.
          </p>
        </div>
      )}

      {/* Step 2 — Analyzing */}
      {step === "analyzing" && (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected shirt"
              className="h-28 w-28 rounded-[var(--radius)] object-cover opacity-80"
            />
          )}
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <Sparkles className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Analyzing with AI…
            </p>
            <p className="mt-1 text-sm text-muted">
              Identifying team, season, version and manufacturer.
            </p>
          </div>
        </div>
      )}

      {/* Step 3 — Form */}
      {step === "form" && (
        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
            {/* Photo preview + change */}
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius)] border border-border bg-surface-2">
                {shownImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shownImage}
                    alt="Shirt"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-2">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  {shownImage ? "Change photo" : "Add photo"}
                </Button>
                <p className="mt-1.5 text-xs text-muted-2">
                  PNG or JPG, up to 10MB.
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="team">Team name</Label>
              <Input
                id="team"
                value={form.team}
                onChange={(e) => update("team", e.target.value)}
                placeholder="e.g. FC Barcelona"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={form.season}
                  onChange={(e) => update("season", e.target.value)}
                  placeholder="e.g. 2019-20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="version">Version</Label>
                <Select
                  id="version"
                  value={form.version}
                  onChange={(e) =>
                    update("version", e.target.value as ShirtFormData["version"])
                  }
                >
                  {VERSIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  id="country"
                  value={form.country}
                  onChange={(e) =>
                    update("country", e.target.value as ShirtFormData["country"])
                  }
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="league">League</Label>
                <Select
                  id="league"
                  value={form.league}
                  onChange={(e) =>
                    update("league", e.target.value as ShirtFormData["league"])
                  }
                >
                  {LEAGUES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                id="manufacturer"
                value={form.manufacturer}
                onChange={(e) =>
                  update(
                    "manufacturer",
                    e.target.value as ShirtFormData["manufacturer"],
                  )
                }
              >
                {MANUFACTURERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Anything memorable about this shirt…"
              />
            </div>

            {!isEditing && aiConfidence !== null && (
              <p className="flex items-start gap-2 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-3 text-xs leading-relaxed text-accent">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                AI suggested these details ({aiConfidence}% confidence) — correct
                anything that&apos;s wrong to help improve future
                identifications.
              </p>
            )}

            {error && (
              <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Save to collection"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
