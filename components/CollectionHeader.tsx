"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Sparkles, Trash2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/Brand";
import { AiQuotaBadge } from "@/components/AiQuotaBadge";
import { PlanBadge } from "@/components/PlanBadge";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface CollectionHeaderProps {
  /** Email of the signed-in user. */
  email: string;
  /** The user's plan, so they can always see which one they are on. */
  plan: string | null;
}

/** Top bar for the collection: brand + account menu with logout. */
export function CollectionHeader({ email, plan }: CollectionHeaderProps) {
  const router = useRouter();
  const initials = email.slice(0, 2).toUpperCase();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
          <DropdownMenu trigger={<Avatar fallback={initials} />}>
            <DropdownMenuLabel>
              <span className="block text-[11px] uppercase tracking-wide text-muted-2">
                Signed in as
              </span>
              <span className="block truncate text-ink">{email}</span>
              {plan && (
                <span className="mt-1 block text-[11px] uppercase tracking-wide text-muted">
                  {plan} plan
                </span>
              )}
            </DropdownMenuLabel>
            {plan === "free" && (
              <DropdownMenuItem onClick={() => router.push("/upgrade")}>
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem destructive onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete account
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        email={email}
      />
    </header>
  );
}
