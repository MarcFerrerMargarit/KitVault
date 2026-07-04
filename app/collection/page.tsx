import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToShirt, type ShirtRow } from "@/lib/db";
import { CollectionHeader } from "@/components/CollectionHeader";
import { ShirtGrid } from "@/components/ShirtGrid";

export default async function CollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this, but re-check so we have the user object.
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("shirts")
    .select("*")
    .order("created_at", { ascending: false });

  const shirts = ((data as ShirtRow[] | null) ?? []).map(rowToShirt);

  return (
    <div className="flex min-h-screen flex-col">
      <CollectionHeader email={user.email ?? "account"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <ShirtGrid initialShirts={shirts} />
      </main>
    </div>
  );
}
