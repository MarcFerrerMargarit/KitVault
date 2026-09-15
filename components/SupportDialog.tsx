"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

/** Mirrors the CHECK constraint in migration 007 and the API's own list. */
const CATEGORIES = ["bug", "idea", "question", "other"] as const;
type Category = (typeof CATEGORIES)[number];

/** Matches the `length(btrim(message)) between 10 and 4000` check. */
const MIN_LENGTH = 10;
const MAX_LENGTH = 4000;

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown back to the user so they know where an answer will land. */
  email: string;
}

export function SupportDialog({
  open,
  onOpenChange,
  email,
}: SupportDialogProps) {
  const { t, locale } = useI18n();
  const [category, setCategory] = React.useState<Category>("bug");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Start clean on every reopen, so a sent message does not greet the next one.
  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setCategory("bug");
      setMessage("");
      setSending(false);
      setSent(false);
      setError(null);
    }
  }

  const trimmed = message.trim();
  const longEnough = trimmed.length >= MIN_LENGTH;

  async function handleSend() {
    if (!longEnough || sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: trimmed,
          // Where they were when they hit the problem, which is half of
          // reproducing it.
          page: typeof window === "undefined" ? null : window.location.pathname,
          locale,
        }),
      });

      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || t.errors.supportFailed);

      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errors.supportFailed);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md">
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-accent" />
          <p className="font-display text-xl uppercase text-ink">
            {t.support.sentTitle}
          </p>
          <p className="max-w-xs text-sm text-muted">{t.support.sentBody}</p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t.support.close}
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md">
      <DialogHeader>
        <DialogTitle>{t.support.title}</DialogTitle>
        <DialogDescription>{t.support.description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 p-6">
        <div>
          <Label htmlFor="support-category">{t.support.categoryLabel}</Label>
          <Select
            id="support-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            disabled={sending}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.support.categories[c]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="support-message">{t.support.messageLabel}</Label>
          <Textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
            placeholder={t.support.messagePlaceholder}
            className="min-h-[140px]"
            disabled={sending}
          />
          <p className="mt-1.5 text-xs text-muted-2">
            {fill(t.support.replyNote, { email })}
          </p>
        </div>

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
          disabled={sending}
        >
          {t.support.cancel}
        </Button>
        <Button
          type="button"
          onClick={handleSend}
          disabled={!longEnough || sending}
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? t.support.sending : t.support.send}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
