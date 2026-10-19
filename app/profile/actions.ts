"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  AVATAR_PREFIX,
  PROFILE_LIMITS,
  normaliseUsername,
  usernameProblem,
} from "@/lib/profile";
import { fill } from "@/lib/i18n/format";
import { getTranslations } from "@/lib/i18n/server";

export interface ProfileResult {
  error?: string;
}

export interface ProfileInput {
  displayName: string;
  bio: string;
  favouriteTeam: string;
}

/** Trimmed, length-capped, and empty strings stored as null. */
function clean(value: string, max: number): string | null {
  const v = value.trim().slice(0, max);
  return v === "" ? null : v;
}

/** Save the editable text fields of the signed-in user's profile. */
export async function updateProfile(
  input: ProfileInput,
): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getTranslations();
  if (!user) return { error: t.errors.notSignedIn };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: clean(input.displayName, PROFILE_LIMITS.displayName),
      bio: clean(input.bio, PROFILE_LIMITS.bio),
      favourite_team: clean(input.favouriteTeam, PROFILE_LIMITS.favouriteTeam),
    })
    .eq("id", user.id);

  if (error) return { error: fill(t.errors.profileSave, { error: error.message }) };

  revalidatePath("/profile");
  revalidatePath("/collection");
  return {};
}

/**
 * Point the profile at a newly uploaded photo, or at none, and delete the one
 * it replaces. The browser uploads the file first (the storage policies only
 * let it write into its own folder); this records it and tidies up.
 */
export async function setAvatar(path: string | null): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getTranslations();
  if (!user) return { error: t.errors.notSignedIn };

  // The database checks this too; refusing early gives a clear message.
  if (path !== null && !path.startsWith(`${user.id}/${AVATAR_PREFIX}`)) {
    return { error: fill(t.errors.profileSave, { error: "invalid path" }) };
  }

  const { data: before } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .maybeSingle();
  const previous = (before?.avatar_path as string | null) ?? null;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", user.id);
  if (error) return { error: fill(t.errors.profileSave, { error: error.message }) };

  // Best effort: a stranded old photo is still caught by account deletion,
  // which empties the whole folder.
  if (previous && previous !== path) {
    await supabase.storage.from("shirts").remove([previous]);
  }

  revalidatePath("/profile");
  revalidatePath("/collection");
  return {};
}

export interface SharingResult {
  error?: string;
  /** The username as stored, so the form can show exactly what was saved. */
  username?: string | null;
}

/**
 * Choose the public address and switch the vault on or off.
 *
 * Validated here so the user gets a reason, and again by the database's CHECK
 * and UNIQUE constraints, which are the ones that actually hold.
 */
export async function updateSharing(input: {
  username: string;
  isPublic: boolean;
}): Promise<SharingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getTranslations();
  if (!user) return { error: t.errors.notSignedIn };

  const username = normaliseUsername(input.username) || null;

  if (username) {
    const problem = usernameProblem(username);
    if (problem === "format") return { error: t.sharing.errors.format };
    if (problem === "reserved") return { error: t.sharing.errors.reserved };
  } else if (input.isPublic) {
    return { error: t.sharing.errors.needsUsername };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, is_public: Boolean(username) && input.isPublic })
    .eq("id", user.id);

  if (error) {
    // 23505: unique_violation. Saying so is unavoidable — a unique name has to
    // tell you when it is taken — and it reveals nothing else about the owner.
    if (error.code === "23505") return { error: t.sharing.errors.taken };
    if (error.code === "23514") return { error: t.sharing.errors.format };
    return { error: fill(t.errors.profileSave, { error: error.message }) };
  }

  revalidatePath("/profile");
  revalidatePath("/collection");
  if (username) revalidatePath(`/u/${username}`);
  return { username };
}
