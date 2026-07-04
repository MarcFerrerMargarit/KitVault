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
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { error } = await supabase
    .from("shirts")
    .update({
      team: data.team.trim(),
      season: data.season.trim(),
      version: data.version,
      country: data.country,
      league: data.league,
      manufacturer: data.manufacturer,
      notes: data.notes.trim() || null,
      ai_label: `${data.team} ${data.version} ${data.season}`,
    })
    .eq("id", id);

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

  const { error } = await supabase.from("shirts").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/collection");
  return {};
}
