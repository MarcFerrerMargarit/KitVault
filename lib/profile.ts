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
  /** Address of the public vault, if one has been chosen. */
  username: string | null;
  /** Whether kitvault.dev/u/<username> is currently visible. */
  isPublic: boolean;
}

/**
 * The signed-in user's profile, with a signed photo URL.
 *
 * Selects every column rather than a list: a column added by a migration that
 * has not been run yet then reads as missing instead of failing the whole
 * query, so the header never breaks over a profile.
 */
export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const row = (data ?? {}) as Record<string, string | boolean | null>;
  const text = (key: string) =>
    typeof row[key] === "string" ? (row[key] as string) : null;
  const avatarPath = text("avatar_path");

  let avatarUrl: string | null = null;
  if (avatarPath) {
    const { data: signed } = await supabase.storage
      .from("shirts")
      .createSignedUrl(avatarPath, AVATAR_LINK_SECONDS);
    avatarUrl = signed?.signedUrl ?? null;
  }

  return {
    displayName: text("display_name"),
    bio: text("bio"),
    favouriteTeam: text("favourite_team"),
    avatarPath,
    avatarUrl,
    createdAt: text("created_at"),
    username: text("username"),
    isPublic: row.is_public === true,
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

/**
 * Username rules — the same as the CHECK constraints in migration 009, so the
 * form can explain a refusal before the database makes one.
 */
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{1,22}[a-z0-9]$/;

export const RESERVED_USERNAMES: ReadonlySet<string> = new Set([
  "admin", "administrator", "api", "app", "auth", "billing", "blog",
  "collection", "contact", "dashboard", "help", "hola", "kitvault",
  "login", "logout", "me", "moderator", "null", "official", "privacy",
  "profile", "root", "settings", "signup", "staff", "support", "system",
  "team", "terms", "undefined", "upgrade", "user", "users", "www",
]);

/** What the user typed, as it would be stored: trimmed, lowercase, no "@". */
export function normaliseUsername(input: string): string {
  return input.trim().replace(/^@+/, "").toLowerCase();
}

/** Why a username would be refused, or null when it is acceptable. */
export function usernameProblem(
  username: string,
): "format" | "reserved" | null {
  if (!USERNAME_PATTERN.test(username)) return "format";
  if (RESERVED_USERNAMES.has(username)) return "reserved";
  return null;
}

/** Path of a public vault; the origin is added where the link is shown. */
export function vaultPath(username: string): string {
  return `/u/${username}`;
}
