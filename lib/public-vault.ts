import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { thumbPath } from "@/lib/image";
import type { Shirt, ShirtVersion } from "@/lib/types";

/** Photo links on a public page last as long as a visit plausibly does. */
const LINK_SECONDS = 60 * 60;

export interface PublicVault {
  username: string;
  displayName: string | null;
  bio: string | null;
  favouriteTeam: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  /** Only the public fields: no notes, and no AI details. */
  shirts: Shirt[];
  stats: { shirts: number; countries: number; leagues: number };
}

interface VaultRow {
  profile: {
    username: string;
    display_name: string | null;
    bio: string | null;
    favourite_team: string | null;
    avatar_path: string | null;
    created_at: string | null;
  };
  shirts: {
    id: string;
    team: string;
    season: string;
    version: ShirtVersion;
    country: string | null;
    league: string | null;
    manufacturer: string | null;
    team_color: string | null;
    secondary_color: string | null;
    image_path: string | null;
    created_at: string;
  }[];
}

/** Distinct, case-insensitively, ignoring blanks. */
function countDistinct(values: (string | null)[]): number {
  return new Set(
    values.map((v) => v?.trim().toLowerCase()).filter(Boolean),
  ).size;
}

/**
 * A public vault by username, or null when it does not exist or is private —
 * the two are deliberately indistinguishable.
 *
 * Reads through `public_vault()` (migration 009), the only way a visitor can
 * reach another user's data; the tables' own policies stay owner-only. Photos
 * are signed with whatever session is present: the storage policy for public
 * vaults lets anyone, signed in or not, read that owner's folder.
 *
 * Wrapped in `cache` so the page, its metadata and its preview image share one
 * database round trip per request.
 */
export const fetchPublicVault = cache(
  async (username: string): Promise<PublicVault | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("public_vault", {
      p_username: username.toLowerCase(),
    });
    if (error || !data) return null;

    const vault = data as VaultRow;
    const rows = vault.shirts ?? [];

    const paths = rows
      .map((r) => r.image_path)
      .filter((p): p is string => Boolean(p));
    const avatarPath = vault.profile.avatar_path;
    const toSign = [
      ...paths,
      ...paths.map(thumbPath),
      ...(avatarPath ? [avatarPath] : []),
    ];

    const urlByPath = new Map<string, string>();
    if (toSign.length > 0) {
      const { data: signed } = await supabase.storage
        .from("shirts")
        .createSignedUrls(toSign, LINK_SECONDS);
      for (const s of signed ?? []) {
        if (s.path && s.signedUrl && !s.error) urlByPath.set(s.path, s.signedUrl);
      }
    }

    const shirts: Shirt[] = rows.map((r) => ({
      id: r.id,
      team: r.team,
      season: r.season,
      version: r.version,
      country: r.country ?? "",
      league: r.league ?? "",
      manufacturer: r.manufacturer ?? "Other",
      teamColor: r.team_color ?? "#4ade80",
      secondaryColor: r.secondary_color ?? undefined,
      imagePath: r.image_path ?? undefined,
      imageUrl: r.image_path ? urlByPath.get(r.image_path) : undefined,
      thumbUrl: r.image_path ? urlByPath.get(thumbPath(r.image_path)) : undefined,
      // Never shown read-only; present only because the type requires it.
      ai: { label: `${r.team} ${r.version} ${r.season}`, confidence: 0 },
      addedAt: r.created_at.slice(0, 10),
    }));

    return {
      username: vault.profile.username,
      displayName: vault.profile.display_name,
      bio: vault.profile.bio,
      favouriteTeam: vault.profile.favourite_team,
      avatarUrl: avatarPath ? (urlByPath.get(avatarPath) ?? null) : null,
      createdAt: vault.profile.created_at,
      shirts,
      stats: {
        shirts: rows.length,
        countries: countDistinct(rows.map((r) => r.country)),
        leagues: countDistinct(rows.map((r) => r.league)),
      },
    };
  },
);
