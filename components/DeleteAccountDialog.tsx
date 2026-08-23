"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteAccount } from "@/app/collection/actions";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Typed back by the user to confirm — this is not undoable. */
  email: string;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  email,
}: DeleteAccountDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [confirmation, setConfirmation] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset whenever the dialog is reopened.
  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setConfirmation("");
      setError(null);
    }
  }

  const confirmed =
    confirmation.trim().toLowerCase() === email.trim().toLowerCase();

  async function handleDelete() {
    if (!confirmed || deleting) return;
    setDeleting(true);
    setError(null);

    const res = await deleteAccount();
    if (res.error) {
      setError(res.error);
      setDeleting(false);
      return;
    }

    onOpenChange(false);
    router.push("/");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md">
      <DialogHeader>
        <DialogTitle>{t.account.delete.title}</DialogTitle>
        <DialogDescription>{t.account.delete.description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 p-6">
        <div className="flex items-start gap-2 rounded-[var(--radius)] border border-danger/40 bg-danger-soft p-3 text-sm text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{t.account.delete.warning}</div>
        </div>

        <div>
          <Label htmlFor="confirm-email">
            {fill(t.account.delete.confirmLabel, { email })}
          </Label>
          <Input
            id="confirm-email"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={email}
            autoComplete="off"
            disabled={deleting}
          />
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
          disabled={deleting}
        >
          {t.account.delete.cancel}
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={!confirmed || deleting}
          className="bg-danger text-white hover:bg-danger/90 disabled:opacity-50"
        >
          {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
          {t.account.delete.confirm}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
