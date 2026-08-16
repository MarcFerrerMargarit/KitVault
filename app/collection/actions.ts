"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { COLLECTION_FULL_CODE, fetchCollectionLimit } from "@/lib/quota";
import { thumbPath } from "@/lib/image";
import type { ShirtFormData } from "@/lib/types";

export interface ActionResult {
  error?: string;
  /** True when the insert was refused because the plan's allowance is spent. */
  collectionFull?: boolean;
}

/** Insert a new shirt owned by the current user. */
export async function createShirt(
  data: ShirtFormData,
  teamColor: string,
  imagePath?: string | null,
  prediction?: Record<string, unknown> | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const confidence =
    prediction && typeof prediction.confidence === "number"
      ? prediction.confidence
      : 80;

  const { data: inserted, error } = await supabase
    .from("shirts")
    .insert({
      user_id: user.id,
      team: data.team.trim(),
      season: data.season.trim(),
      version: data.version,
      country: data.country,
      league: data.league,
      manufacturer: data.manufacturer,
      notes: data.notes.trim() || null,
      team_color: teamColor,
      image_path: imagePath ?? null,
      ai_label: `${data.team} ${data.version} ${data.season}`,
      ai_confidence: confidence,
    })
    .select("id")
    .single();

  if (error) {
    // The photo is uploaded before the row is inserted, so a failed insert
    // would otherwise leave an orphan file sitting in the user's quota.
    if (imagePath) {
      await supabase.storage
        .from("shirts")
        .remove([imagePath, thumbPath(imagePath)]);
    }
    // The plan's collection limit is enforced by a trigger, so a full
    // collection arrives here as a database error rather than a check we ran.
    if (error.code === COLLECTION_FULL_CODE) {
      const limit = await fetchCollectionLimit(supabase);
      return {
        collectionFull: true,
        error: limit
          ? `Your ${limit.plan} plan holds ${limit.maxShirts} shirts and you have ${limit.used}. Upgrade to add more.`
          : "Your collection is full. Upgrade your plan to add more shirts.",
      };
    }
    return { error: error.message };
  }

  // Record the AI prediction vs. what the user actually saved (Phase 5 data).
  if (prediction && inserted) {
    await supabase.from("ai_corrections").insert({
      shirt_id: (inserted as { id: string }).id,
      user_id: user.id,
      image_path: imagePath ?? null,
      predicted: prediction,
      corrected: {
        team: data.team.trim(),
        season: data.season.trim(),
        version: data.version,
        country: data.country,
        league: data.league,
        manufacturer: data.manufacturer,
      },
    });
  }

  revalidatePath("/collection");
  return {};
}

/** Update one of the current user's shirts. RLS restricts this to the owner. */
export async function updateShirt(
  id: string,
  data: ShirtFormData,
  imagePath?: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const patch: Record<string, unknown> = {
    team: data.team.trim(),
    season: data.season.trim(),
    version: data.version,
    country: data.country,
    league: data.league,
    manufacturer: data.manufacturer,
    notes: data.notes.trim() || null,
    ai_label: `${data.team} ${data.version} ${data.season}`,
  };
  // Only touch the photo when a new one was provided.
  if (imagePath !== undefined) patch.image_path = imagePath;

  // `user_id` is redundant with RLS, but keeps the row unreachable even if the
  // policies were ever dropped.
  const { error } = await supabase
    .from("shirts")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/collection");
  return {};
}

/** Delete one of the current user's shirts. */
export async function deleteShirt(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  // Look up the photo so we can remove it from storage too (best-effort).
  const { data: row } = await supabase
    .from("shirts")
    .select("image_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase
    .from("shirts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  const imagePath = (row as { image_path: string | null } | null)?.image_path;
  if (imagePath) {
    // Remove the thumbnail too; older shirts have none and that path is
    // simply ignored.
    await supabase.storage
      .from("shirts")
      .remove([imagePath, thumbPath(imagePath)]);
  }

  revalidatePath("/collection");
  return {};
}

/** Storage list pages at 100 by default; ask for the maximum per round trip. */
const STORAGE_PAGE = 1000;

/**
 * Delete the signed-in user's account and everything attached to it.
 *
 * Order matters: the photos go first, while we can still authenticate as their
 * owner. Storage objects are not covered by the database's `on delete cascade`,
 * so once `auth.users` is gone there is no session left that the storage
 * policies would accept, and the files would be stranded for good.
 */
export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  // List the whole folder rather than reading `shirts.image_path`: that also
  // catches uploads whose row never made it in.
  const paths: string[] = [];
  for (let offset = 0; ; offset += STORAGE_PAGE) {
    const { data: files, error } = await supabase.storage
      .from("shirts")
      .list(user.id, { limit: STORAGE_PAGE, offset });
    if (error) return { error: `Could not list your photos: ${error.message}` };
    if (!files || files.length === 0) break;
    paths.push(...files.map((file) => `${user.id}/${file.name}`));
    if (files.length < STORAGE_PAGE) break;
  }

  if (paths.length > 0) {
    const { error } = await supabase.storage.from("shirts").remove(paths);
    // Stop rather than orphan the files: the account still exists, so the user
    // can retry. Deleting it first would make them unreachable forever.
    if (error) {
      return { error: `Could not delete your photos: ${error.message}` };
    }
  }

  // Cascades to profiles, shirts, ai_corrections and ai_usage.
  const { error } = await supabase.rpc("delete_own_account");
  if (error)
    return { error: `Could not delete your account: ${error.message}` };

  await supabase.auth.signOut();
  return {};
}
