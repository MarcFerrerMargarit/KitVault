"use client";

import * as React from "react";
import { UploadCloud, Sparkles, Loader2, Info, ImagePlus } from "lucide-react";
import type { Shirt, ShirtFormData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { prepareImages, thumbPath, type PreparedImages } from "@/lib/image";
import { useQuota } from "@/components/QuotaProvider";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShirtFields } from "@/components/ShirtFields";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

type Step = "upload" | "analyzing" | "form";

/** Extra info passed alongside the form data when saving. */
export interface SaveMeta {
  id?: string;
  /** New storage path when a photo was uploaded; `undefined` = leave unchanged. */
  imagePath?: string | null;
  /** URL to show immediately (optimistic). */
  previewUrl?: string;
  /** Raw AI prediction, stored to `ai_corrections` for new shirts. */
  prediction?: Record<string, unknown> | null;
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
  const { t } = useI18n();
  const { quota, setQuota } = useQuota();
  // `null` quota = unknown (migration not run); don't block the user on it.
  const outOfCredit = quota !== null && quota.remaining <= 0;
  const [step, setStep] = React.useState<Step>("upload");
  const [form, setForm] = React.useState<ShirtFormData>(EMPTY_FORM);
  const [aiConfidence, setAiConfidence] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);

  /** The picked photo, downscaled. `thumb` is null if downscaling failed. */
  const [upload, setUpload] = React.useState<{
    full: File;
    thumb: File | null;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [prediction, setPrediction] = React.useState<Record<
    string,
    unknown
  > | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset the flow whenever the modal transitions to open.
  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setUpload(null);
      setPreviewUrl(null);
      setSaving(false);
      setError(null);
      setPrediction(null);
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

  // Send the photo to Gemini and pre-fill the form with its best guess.
  const runIdentify = React.useCallback(
    async (picked: File) => {
      setStep("analyzing");
      setError(null);
      try {
        const fd = new FormData();
        fd.append("image", picked);
        const res = await fetch("/api/identify", { method: "POST", body: fd });
        const json = await res.json();
        // The server reports the authoritative remaining count on success and
        // on refusal alike — keep the header counter in step with it.
        if (json.quota) setQuota(json.quota);
        if (!res.ok) throw new Error(json.error || "Identification failed");

        setForm({
          team: json.team || "",
          season: json.season || "",
          version: json.version,
          country: json.country,
          league: json.league,
          manufacturer: json.manufacturer,
          notes: "",
        });
        setAiConfidence(
          typeof json.confidence === "number" ? json.confidence : null,
        );
        setPrediction({
          team: json.team,
          season: json.season,
          version: json.version,
          country: json.country,
          league: json.league,
          manufacturer: json.manufacturer,
          confidence: json.confidence,
        });
        setStep("form");
      } catch (e) {
        // Fall back to a blank form so the user can still add the shirt manually.
        setForm(EMPTY_FORM);
        setAiConfidence(null);
        setPrediction(null);
        setError(e instanceof Error ? e.message : t.addShirt.identifyFailed);
        setStep("form");
      }
    },
    [setQuota, t.addShirt.identifyFailed],
  );

  const selectFile = async (picked: File | undefined) => {
    if (!picked || !picked.type.startsWith("image/")) return;
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(picked);
    });

    const identifying = !isEditing && step === "upload" && !outOfCredit;
    // Show the spinner before the (brief) downscale, so picking a photo feels
    // instant even on a slow phone.
    if (identifying) setStep("analyzing");

    // Downscale before anything leaves the browser: a raw 4MB phone photo
    // costs storage and, on every grid view afterwards, bandwidth.
    let prepared: PreparedImages | null = null;
    try {
      prepared = await prepareImages(picked);
    } catch {
      // Unsupported or corrupt file — upload the original rather than refuse.
      prepared = null;
    }
    setUpload(
      prepared
        ? { full: prepared.full, thumb: prepared.thumb }
        : { full: picked, thumb: null },
    );

    if (isEditing || step !== "upload") return;

    // No credit left: skip the API call entirely and let the user type the
    // details in. Saving the shirt itself is never rationed.
    if (outOfCredit) {
      setError(
        fill(t.addShirt.quotaNoneError, { limit: quota?.userLimit ?? 0 }),
      );
      setStep("form");
      return;
    }
    // Send the downscaled copy: same tokens (Gemini tiles the image anyway),
    // far less to upload.
    runIdentify(prepared?.full ?? picked);
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
    if (upload) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError(t.errors.notSignedIn);
        setSaving(false);
        return;
      }
      const ext = upload.full.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("shirts")
        .upload(path, upload.full, {
          contentType: upload.full.type,
          upsert: false,
        });
      if (upErr) {
        setError(fill(t.addShirt.uploadFailed, { error: upErr.message }));
        setSaving(false);
        return;
      }

      // The thumbnail is what the grid loads. Best-effort: if it fails the
      // shirt still saves and the grid falls back to the full image.
      if (upload.thumb) {
        await supabase.storage
          .from("shirts")
          .upload(thumbPath(path), upload.thumb, {
            contentType: upload.thumb.type,
            upsert: true,
          });
      }

      uploadedPath = path;
    }

    onSave(form, {
      id: editingShirt?.id,
      imagePath: uploadedPath,
      previewUrl: previewUrl ?? editingShirt?.imageUrl,
      prediction: editingShirt ? undefined : prediction,
    });
    onOpenChange(false);
  };

  const shownImage = previewUrl ?? editingShirt?.imageUrl ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? t.addShirt.titleEdit : t.addShirt.titleAdd}
        </DialogTitle>
        <DialogDescription>
          {step === "form" ? t.addShirt.descForm : t.addShirt.descUpload}
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
              <p className="font-medium text-ink">{t.addShirt.dropTitle}</p>
              <p className="mt-1 text-sm text-muted">{t.addShirt.dropBody}</p>
            </div>
          </div>
          {quota === null ? null : outOfCredit ? (
            <p className="mt-3 flex items-start justify-center gap-1.5 rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-xs text-danger">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {fill(t.addShirt.quotaNoneTitle, {
                limit: quota.userLimit,
                plan: quota.plan,
              })}
            </p>
          ) : (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-2">
              <Sparkles className="h-3.5 w-3.5" />
              {fill(t.addShirt.quotaLeft, {
                remaining: quota.remaining,
                limit: quota.userLimit,
              })}
            </p>
          )}
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
              {t.addShirt.analyzing}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t.addShirt.analyzingBody}
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
                  {shownImage ? t.addShirt.changePhoto : t.addShirt.addPhoto}
                </Button>
                <p className="mt-1.5 text-xs text-muted-2">
                  {t.addShirt.photoHint}
                </p>
              </div>
            </div>

            <ShirtFields value={form} onChange={update} />

            {!isEditing && aiConfidence !== null && (
              <p className="flex items-start gap-2 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-3 text-xs leading-relaxed text-accent">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {fill(t.addShirt.aiSuggested, { confidence: aiConfidence })}
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
              {t.addShirt.cancel}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? t.addShirt.saveEdit : t.addShirt.save}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
