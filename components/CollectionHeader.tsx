"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/Brand";
import { AiQuotaBadge } from "@/components/AiQuotaBadge";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface CollectionHeaderProps {
  /** Email of the signed-in user. */
  email: string;
}

/** Top bar for the collection: brand + account menu with logout. */
export function CollectionHeader({ email }: CollectionHeaderProps) {
  const router = useRouter();
  const initials = email.slice(0, 2).toUpperCase();

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
        <div className="flex items-center gap-3">
          <AiQuotaBadge />
          <DropdownMenu trigger={<Avatar fallback={initials} />}>
            <DropdownMenuLabel>
              <span className="block text-[11px] uppercase tracking-wide text-muted-2">
                Signed in as
              </span>
              <span className="block truncate text-ink">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem destructive onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
