import type {
  Country,
  League,
  Manufacturer,
  Shirt,
  ShirtVersion,
} from "./types";

/** Shape of a row in the `shirts` table (snake_case, as stored in Postgres). */
export interface ShirtRow {
  id: string;
  user_id: string;
  team: string;
  season: string;
  version: ShirtVersion;
  country: string | null;
  league: string | null;
  manufacturer: Manufacturer;
  team_color: string | null;
  secondary_color: string | null;
  notes: string | null;
  image_path: string | null;
  ai_label: string | null;
  ai_confidence: number | null;
  created_at: string;
  updated_at: string;
}

/** Map a database row to the app-facing `Shirt` shape used by the UI. */
export function rowToShirt(row: ShirtRow): Shirt {
  return {
    id: row.id,
    team: row.team,
    season: row.season,
    version: row.version,
    country: (row.country ?? "England") as Country,
    league: (row.league ?? "Premier League") as League,
    manufacturer: row.manufacturer,
    teamColor: row.team_color ?? "#4ade80",
    secondaryColor: row.secondary_color ?? undefined,
    notes: row.notes ?? undefined,
    ai: {
      label: row.ai_label ?? `${row.team} ${row.version} ${row.season}`,
      confidence: row.ai_confidence ?? 0,
    },
    addedAt: row.created_at.slice(0, 10),
  };
}
