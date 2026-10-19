import type { SupabaseClient } from "@supabase/supabase-js";

/** Field limits — the same numbers as the CHECK constraints in migration 008. */
export const PROFILE_LIMITS = {
  displayName: 40,
  bio: 280,
  favouriteTeam: 60,
} as const;

/** Avatars live in the user's own folder of the `shirts` bucket. */
export const AVATAR_PREFIX = "avatar-";

/** How long a signed avatar link lasts; it is re-signed on every page load. */
const AVATAR_LINK_SECONDS = 60 * 60;

export interface Profile {
  displayName: string | null;
  bio: string | null;
  favouriteTeam: string | null;
  avatarPath: string | null;
  /** Signed, short-lived URL — the bucket is private. */
  avatarUrl: string | null;
  createdAt: string | null;
}

/**
 * The signed-in user's profile, with a signed photo URL.
 *
 * Returns empty fields rather than throwing when the row or the migration-008
 * columns are missing, so the header never breaks over a profile.
 */
export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile> {
  const { data } = await supabase
    .from("profiles")
    .select("display_name, bio, favourite_team, avatar_path, created_at")
    .eq("id", userId)
    .maybeSingle();

  const row = (data ?? {}) as Record<string, string | null>;
  const avatarPath = row.avatar_path ?? null;

  let avatarUrl: string | null = null;
  if (avatarPath) {
    const { data: signed } = await supabase.storage
      .from("shirts")
      .createSignedUrl(avatarPath, AVATAR_LINK_SECONDS);
    avatarUrl = signed?.signedUrl ?? null;
  }

  return {
    displayName: row.display_name ?? null,
    bio: row.bio ?? null,
    favouriteTeam: row.favourite_team ?? null,
    avatarPath,
    avatarUrl,
    createdAt: row.created_at ?? null,
  };
}

/** Two letters for the initials avatar: from the name if set, else the email. */
export function initialsFor(displayName: string | null, email: string): string {
  const name = displayName?.trim();
  if (name) {
    const words = name.split(/\s+/).filter(Boolean);
    const letters =
      words.length > 1 ? words[0][0] + words[words.length - 1][0] : name.slice(0, 2);
    return letters.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}
