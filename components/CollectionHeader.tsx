"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  LifeBuoy,
  LogOut,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/Brand";
import { AiQuotaBadge } from "@/components/AiQuotaBadge";
import { PlanBadge } from "@/components/PlanBadge";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { SupportDialog } from "@/components/SupportDialog";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/I18nProvider";
import { initialsFor } from "@/lib/profile";

interface CollectionHeaderProps {
  /** Email of the signed-in user. */
  email: string;
  /** The user's plan, so they can always see which one they are on. */
  plan: string | null;
  /** Name from the profile page, if set. */
  displayName?: string | null;
  /** Signed URL of the profile photo, if there is one. */
  avatarUrl?: string | null;
}

/** Top bar for the collection: brand + account menu with logout. */
export function CollectionHeader({
  email,
  plan,
  displayName,
  avatarUrl,
}: CollectionHeaderProps) {
  const { t } = useI18n();
  const router = useRouter();
  const initials = initialsFor(displayName ?? null, email);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [supportOpen, setSupportOpen] = React.useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand href="/collection" />
        <div className="flex items-center gap-2 sm:gap-3">
          <PlanBadge plan={plan} />
          <AiQuotaBadge />
          {/* Kept out of the account menu on purpose: while the app is being
              tried out, the way to report a problem should be the one thing
              nobody has to go looking for. */}
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            title={t.support.trigger}
            aria-label={t.support.trigger}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius)] text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <LifeBuoy className="h-[18px] w-[18px]" />
          </button>
          <DropdownMenu trigger={<Avatar fallback={initials} src={avatarUrl} />}>
            <DropdownMenuLabel>
              <span className="block text-[11px] uppercase tracking-wide text-muted-2">
                {t.account.signedInAs}
              </span>
              {displayName && (
                <span className="block truncate font-medium text-ink">
                  {displayName}
                </span>
              )}
              <span
                className={
                  displayName
                    ? "block truncate text-xs text-muted"
                    : "block truncate text-ink"
                }
              >
                {email}
              </span>
              {plan && (
                <span className="mt-1 block text-[11px] uppercase tracking-wide text-muted">
                  {plan} {t.account.planSuffix}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="h-4 w-4" />
              {t.account.profile}
            </DropdownMenuItem>
            {plan === "free" && (
              <DropdownMenuItem onClick={() => router.push("/upgrade")}>
                <Sparkles className="h-4 w-4" />
                {t.account.upgrade}
              </DropdownMenuItem>
            )}
            {/* A plain navigation: the route answers with an attachment, so the
                browser downloads it and the page stays where it is. */}
            <DropdownMenuItem
              onClick={() => {
                window.location.href = "/api/export";
              }}
            >
              <Download className="h-4 w-4" />
              {t.account.exportData}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              {t.account.logout}
            </DropdownMenuItem>
            <DropdownMenuItem destructive onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              {t.account.deleteAccount}
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        email={email}
      />

      <SupportDialog
        open={supportOpen}
        onOpenChange={setSupportOpen}
        email={email}
      />
    </header>
  );
}
