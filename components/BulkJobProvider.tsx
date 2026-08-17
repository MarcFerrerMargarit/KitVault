"use client";

import * as React from "react";
import type { ShirtFormData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { prepareImages, thumbPath } from "@/lib/image";
import { useQuota } from "@/components/QuotaProvider";
import { createShirts, type BulkResult } from "@/app/collection/actions";

/** How many photos one batch may hold. */
export const MAX_FILES = 20;

/**
 * Gap between identify calls. The server enforces a global per-minute burst
 * guard (`ai_limits.global_burst_per_minute`) to stay inside Gemini's
 * requests-per-minute ceiling; pacing here keeps a batch from tripping it on
 * every photo.
 */
const PACE_MS = 1200;
/** How long to wait out a burst refusal, and how many times to try. */
const BURST_BACKOFF_MS = 12_000;
const BURST_RETRIES = 3;

const EMPTY_FORM: ShirtFormData = {
  team: "",
  season: "",
  version: "Home",
  country: "",
  league: "",
  manufacturer: "",
  notes: "",
};

// Palette for the card side band, mirroring the single-add flow.
const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#c084fc",
  "#f97316",
  "#ef4444",
  "#14b8a6",
  "#eab308",
];

export interface BulkItem {
  id: string;
  previewUrl: string;
  full: File;
  thumb: File | null;
  form: ShirtFormData;
  teamColor: string;
  confidence: number | null;
  prediction: Record<string, unknown> | null;
  /** Set when identification could not run — the user fills it in by hand. */
  aiError: string | null;
}

export type BulkStatus = "idle" | "analyzing" | "ready" | "saving";

interface BulkJobValue {
  status: BulkStatus;
  items: BulkItem[];
  progress: { done: number; total: number };
  error: string | null;
  /** Whether the review dialog is on screen. Independent of the job. */
  open: boolean;
  current: number;
  setOpen: (open: boolean) => void;
  setCurrent: (index: number) => void;
  start: (files: File[]) => void;
  updateItem: <K extends keyof ShirtFormData>(
    index: number,
    key: K,
    value: ShirtFormData[K],
  ) => void;
  removeItem: (index: number) => void;
  discard: () => void;
  saveAll: () => void;
  /** How many shirts still need a team and a season. */
  incomplete: number;
}

const BulkJobContext = React.createContext<BulkJobValue | null>(null);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs a bulk batch independently of the dialog that started it.
 *
 * The analysis is a long, paced sequence of network calls, and it used to live
 * inside the modal: clicking the backdrop unmounted it and silently threw the
 * work away. Here the job outlives the dialog, so closing the review just hides
 * it — a badge keeps reporting progress and reopens it on demand.
 */
export function BulkJobProvider({
  onSaved,
  children,
}: {
  onSaved: (result: BulkResult) => void;
  children: React.ReactNode;
}) {
  const { setQuota } = useQuota();
  const [status, setStatus] = React.useState<BulkStatus>("idle");
  const [items, setItems] = React.useState<BulkItem[]>([]);
  const [progress, setProgress] = React.useState({ done: 0, total: 0 });
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);

  // Bumped on discard so an in-flight batch knows to stop.
  const jobRef = React.useRef(0);

  const incomplete = items.filter(
    (item) => !item.form.team.trim() || !item.form.season.trim(),
  ).length;

  /** Identify one photo, waiting out the burst guard if it trips. */
  const identify = React.useCallback(
    async (file: File) => {
      for (let attempt = 0; ; attempt++) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/identify", { method: "POST", body: fd });
        const json = await res.json();
        if (json.quota) setQuota(json.quota);

        if (res.ok) return { json, error: null as string | null };

        // Too many identifications at once across the whole app: this one is
        // worth waiting for, unlike a spent daily quota.
        if (json.reason === "burst" && attempt < BURST_RETRIES) {
          await sleep(BURST_BACKOFF_MS);
          continue;
        }
        return { json: null, error: json.error || "Identification failed" };
      }
    },
    [setQuota],
  );

  const start = React.useCallback(
    (picked: File[]) => {
      const files = picked
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, MAX_FILES);
      if (files.length === 0) return;

      const job = ++jobRef.current;
      setError(
        picked.length > MAX_FILES
          ? `Up to ${MAX_FILES} photos at a time — using the first ${MAX_FILES}.`
          : null,
      );
      setItems([]);
      setCurrent(0);
      setStatus("analyzing");
      setProgress({ done: 0, total: files.length });

      void (async () => {
        const built: BulkItem[] = [];
        let quotaSpent = false;

        for (const [index, file] of files.entries()) {
          if (jobRef.current !== job) return; // discarded
          // Report the photo being worked on, not the count finished.
          setProgress({ done: index, total: files.length });

          let full = file;
          let thumb: File | null = null;
          try {
            const prepared = await prepareImages(file);
            full = prepared.full;
            thumb = prepared.thumb;
          } catch {
            // Keep the original; the upload still works.
          }

          const item: BulkItem = {
            id: `${job}-${index}`,
            previewUrl: URL.createObjectURL(file),
            full,
            thumb,
            form: { ...EMPTY_FORM },
            teamColor: COLORS[index % COLORS.length],
            confidence: null,
            prediction: null,
            aiError: null,
          };

          // Once the daily allowance is gone, stop calling the API for the
          // rest of the batch: they would all be refused.
          if (quotaSpent) {
            item.aiError =
              "No AI identifications left — fill this one in by hand.";
          } else {
            const { json, error: identifyError } = await identify(full);
            if (jobRef.current !== job) return;
            if (json) {
              item.form = {
                team: json.team || "",
                season: json.season || "",
                version: json.version,
                country: json.country || "",
                league: json.league || "",
                manufacturer: json.manufacturer || "",
                notes: "",
              };
              item.confidence =
                typeof json.confidence === "number" ? json.confidence : null;
              item.prediction = {
                team: json.team,
                season: json.season,
                version: json.version,
                country: json.country,
                league: json.league,
                manufacturer: json.manufacturer,
                confidence: json.confidence,
              };
            } else {
              item.aiError = identifyError;
              if (
                identifyError &&
                /identifications for today|shared AI limit/i.test(identifyError)
              ) {
                quotaSpent = true;
              }
            }
            if (index < files.length - 1) await sleep(PACE_MS);
          }

          built.push(item);
          // Publish as we go, so reopening mid-batch shows what is done.
          setItems([...built]);
        }

        if (jobRef.current !== job) return;
        setProgress({ done: files.length, total: files.length });
        setStatus("ready");
      })();
    },
    [identify],
  );

  const updateItem = React.useCallback(
    <K extends keyof ShirtFormData>(
      index: number,
      key: K,
      value: ShirtFormData[K],
    ) =>
      setItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, form: { ...item.form, [key]: value } }
            : item,
        ),
      ),
    [],
  );

  const removeItem = React.useCallback((index: number) => {
    setItems((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      const next = prev.filter((_, i) => i !== index);
      setCurrent((c) => Math.min(c, Math.max(next.length - 1, 0)));
      return next;
    });
  }, []);

  const discard = React.useCallback(() => {
    jobRef.current++; // stops any in-flight batch
    setItems((prev) => {
      for (const item of prev) URL.revokeObjectURL(item.previewUrl);
      return [];
    });
    setStatus("idle");
    setProgress({ done: 0, total: 0 });
    setError(null);
    setCurrent(0);
    setOpen(false);
  }, []);

  const saveAll = React.useCallback(() => {
    void (async () => {
      if (items.length === 0 || incomplete > 0) return;
      setStatus("saving");
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You are not signed in.");
        setStatus("ready");
        return;
      }

      const payload = [];
      for (const item of items) {
        const ext = item.full.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("shirts")
          .upload(path, item.full, {
            contentType: item.full.type,
            upsert: false,
          });
        if (upErr) {
          setError(
            `Photo upload failed for ${item.form.team}: ${upErr.message}`,
          );
          setStatus("ready");
          return;
        }
        if (item.thumb) {
          await supabase.storage
            .from("shirts")
            .upload(thumbPath(path), item.thumb, {
              contentType: item.thumb.type,
              upsert: true,
            });
        }
        payload.push({
          data: item.form,
          teamColor: item.teamColor,
          imagePath: path,
          prediction: item.prediction,
        });
      }

      const result = await createShirts(payload);
      for (const item of items) URL.revokeObjectURL(item.previewUrl);
      jobRef.current++;
      setItems([]);
      setStatus("idle");
      setProgress({ done: 0, total: 0 });
      setOpen(false);
      onSaved(result);
    })();
  }, [items, incomplete, onSaved]);

  // Progress in the tab title, so a background batch is visible from another
  // tab without leaving the page open.
  React.useEffect(() => {
    if (status === "idle") return;
    const original = document.title;
    document.title =
      status === "analyzing"
        ? `(${Math.min(progress.done + 1, progress.total)}/${progress.total}) Analyzing…`
        : `(${items.length}) Ready to review — KitVault`;
    return () => {
      document.title = original;
    };
  }, [status, progress, items.length]);

  // A batch in flight or waiting for review is real work that a reload throws
  // away, including the AI credits already spent on it.
  React.useEffect(() => {
    if (status === "idle") return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const value = React.useMemo<BulkJobValue>(
    () => ({
      status,
      items,
      progress,
      error,
      open,
      current,
      setOpen,
      setCurrent,
      start,
      updateItem,
      removeItem,
      discard,
      saveAll,
      incomplete,
    }),
    [
      status,
      items,
      progress,
      error,
      open,
      current,
      start,
      updateItem,
      removeItem,
      discard,
      saveAll,
      incomplete,
    ],
  );

  return (
    <BulkJobContext.Provider value={value}>{children}</BulkJobContext.Provider>
  );
}

export function useBulkJob(): BulkJobValue {
  const ctx = React.useContext(BulkJobContext);
  if (!ctx) throw new Error("useBulkJob must be used inside BulkJobProvider");
  return ctx;
}
