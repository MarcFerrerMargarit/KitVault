"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ShirtFormData } from "@/lib/types";

export interface ActionResult {
  error?: string;
}

/** Insert a new shirt owned by the current user. */
export async function createShirt(
  data: ShirtFormData,
  teamColor: string,
  imagePath?: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { error } = await supabase.from("shirts").insert({
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
    ai_confidence: 80,
  });

  if (error) return { error: error.message };
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

  const { error } = await supabase.from("shirts").update(patch).eq("id", id);

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
    .single();

  const { error } = await supabase.from("shirts").delete().eq("id", id);
  if (error) return { error: error.message };

  const imagePath = (row as { image_path: string | null } | null)?.image_path;
  if (imagePath) {
    await supabase.storage.from("shirts").remove([imagePath]);
  }

  revalidatePath("/collection");
  return {};
}
