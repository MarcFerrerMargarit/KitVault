/**
 * Core domain types for KitVault.
 * Kept strict — no `any`.
 */

export type ShirtVersion = "Home" | "Away" | "Third" | "GK";

export type Manufacturer =
  | "Adidas"
  | "Nike"
  | "Puma"
  | "Umbro"
  | "Kappa"
  | "Other";

export type League =
  | "Premier League"
  | "LaLiga"
  | "Serie A"
  | "Bundesliga"
  | "Ligue 1"
  | "Champions League"
  | "Eredivisie";

export type Country =
  | "England"
  | "Spain"
  | "Italy"
  | "Germany"
  | "France"
  | "Netherlands";

export interface Shirt {
  id: string;
  team: string;
  season: string; // e.g. "2019-20"
  version: ShirtVersion;
  country: Country;
  league: League;
  manufacturer: Manufacturer;
  /** Primary team color, used for the card's side band. Hex. */
  teamColor: string;
  /** Optional secondary color for the placeholder gradient. Hex. */
  secondaryColor?: string;
  notes?: string;
  /** Storage path in the `shirts` bucket, if a photo was uploaded. */
  imagePath?: string;
  /** Resolved (signed) URL for display. Not persisted in the DB. */
  imageUrl?: string;
  /** Mock AI identification metadata. */
  ai: {
    label: string; // e.g. "FC Barcelona Home 2019-20"
    confidence: number; // 0-100
  };
  /** ISO date the shirt was added to the collection. */
  addedAt: string;
}

/** The editable subset of a shirt used by the Add / Edit forms. */
export interface ShirtFormData {
  team: string;
  season: string;
  version: ShirtVersion;
  country: Country;
  league: League;
  manufacturer: Manufacturer;
  notes: string;
}

/** Active state of the collection filter bar. */
export interface ShirtFilters {
  search: string;
  country: Country | "all";
  league: League | "all";
  season: string | "all";
  version: ShirtVersion | "all";
}
