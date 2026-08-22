import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToShirt, type ShirtRow } from "@/lib/db";
import { fetchCollectionLimit, fetchQuota } from "@/lib/quota";
import { thumbPath } from "@/lib/image";
import { CollectionHeader } from "@/components/CollectionHeader";
import { QuotaProvider } from "@/components/QuotaProvider";
import { ShirtGrid } from "@/components/ShirtGrid";

export default async function CollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this, but re-check so we have the user object.
  if (!user) redirect("/login");

  // RLS already restricts this to the owner; the explicit filter is defence in
  // depth, so a regression in the policies cannot turn into a data leak.
  const { data } = await supabase
    .from("shirts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const shirts = ((data as ShirtRow[] | null) ?? []).map(rowToShirt);

  // Resolve signed URLs for shirts that have an uploaded photo (private bucket).
  const paths = shirts
    .map((s) => s.imagePath)
    .filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    // Sign the thumbnails alongside the full images. Shirts added before
    // thumbnails existed have no file there, so those entries come back with
    // an error and are simply skipped — the grid falls back to the full image.
    const { data: signed } = await supabase.storage
      .from("shirts")
      .createSignedUrls([...paths, ...paths.map(thumbPath)], 60 * 60); // 1 hour

    const urlByPath = new Map(
      (signed ?? [])
        .filter((s) => s.signedUrl && !s.error)
        .map((s) => [s.path, s.signedUrl]),
    );

    for (const shirt of shirts) {
      if (!shirt.imagePath) continue;
      shirt.imageUrl = urlByPath.get(shirt.imagePath) ?? undefined;
      shirt.thumbUrl = urlByPath.get(thumbPath(shirt.imagePath)) ?? undefined;
    }
  }

  // AI identifications left today, and how many shirts the plan allows.
  // Both are null if they cannot be read (e.g. a migration has not been run).
  const [quota, collectionLimit] = await Promise.all([
    fetchQuota(supabase),
    fetchCollectionLimit(supabase),
  ]);

  return (
    <QuotaProvider initial={quota}>
      <div className="flex min-h-screen flex-col">
        <CollectionHeader
          email={user.email ?? "account"}
          plan={collectionLimit?.plan ?? null}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <ShirtGrid initialShirts={shirts} collectionLimit={collectionLimit} />
        </main>
      </div>
    </QuotaProvider>
  );
}
