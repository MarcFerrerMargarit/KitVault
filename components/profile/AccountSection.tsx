"use client";

import * as React from "react";
import Link from "next/link";
import { Download, KeyRound, Trash2 } from "lucide-react";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/I18nProvider";

/**
 * Email and the account-level actions. They also live in the header menu; here
 * they sit where people look for them on a settings page.
 */
export function AccountSection({ email }: { email: string }) {
  const { t } = useI18n();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-2">
          {t.profile.email}
        </p>
        <p className="mt-1 break-all text-sm text-ink">{email}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Works for a signed-in user as well as after a recovery link. */}
        <Link href="/update-password">
          <Button type="button" variant="secondary" size="sm">
            <KeyRound className="h-4 w-4" />
            {t.profile.changePassword}
          </Button>
        </Link>
        {/* The route answers with an attachment, so the page stays put. */}
        <a href="/api/export">
          <Button type="button" variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t.account.exportData}
          </Button>
        </a>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          {t.account.deleteAccount}
        </Button>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        email={email}
      />
    </div>
  );
}
