import type {
  Country,
  League,
  Manufacturer,
  Shirt,
  ShirtVersion,
} from "./types";

/**
 * Static mock collection. No backend yet (Phase 1).
 * Each shirt carries a `teamColor` used for the card's side band, plus a
 * `secondaryColor` to build the placeholder gradient when there is no photo.
 */
export const MOCK_SHIRTS: Shirt[] = [
  {
    id: "fcb-home-1920",
    team: "FC Barcelona",
    season: "2019-20",
    version: "Home",
    country: "Spain",
    league: "LaLiga",
    manufacturer: "Nike",
    teamColor: "#a50044",
    secondaryColor: "#004d98",
    notes: "Worn during the last full Messi season at the Camp Nou.",
    ai: { label: "FC Barcelona Home 2019-20", confidence: 87 },
    addedAt: "2024-09-12",
  },
  {
    id: "mcity-home-2223",
    team: "Manchester City",
    season: "2022-23",
    version: "Home",
    country: "England",
    league: "Premier League",
    manufacturer: "Puma",
    teamColor: "#6cabdd",
    secondaryColor: "#1c2c5b",
    notes: "Treble-winning campaign.",
    ai: { label: "Manchester City Home 2022-23", confidence: 94 },
    addedAt: "2024-10-02",
  },
  {
    id: "juve-home-1718",
    team: "Juventus",
    season: "2017-18",
    version: "Home",
    country: "Italy",
    league: "Serie A",
    manufacturer: "Adidas",
    teamColor: "#000000",
    secondaryColor: "#ffffff",
    ai: { label: "Juventus Home 2017-18", confidence: 91 },
    addedAt: "2024-05-21",
  },
  {
    id: "bvb-home-2324",
    team: "Borussia Dortmund",
    season: "2023-24",
    version: "Home",
    country: "Germany",
    league: "Bundesliga",
    manufacturer: "Puma",
    teamColor: "#fde100",
    secondaryColor: "#000000",
    notes: "Champions League finalists.",
    ai: { label: "Borussia Dortmund Home 2023-24", confidence: 96 },
    addedAt: "2024-11-18",
  },
  {
    id: "psg-away-2021",
    team: "Paris Saint-Germain",
    season: "2020-21",
    version: "Away",
    country: "France",
    league: "Ligue 1",
    manufacturer: "Nike",
    teamColor: "#004170",
    secondaryColor: "#da291c",
    ai: { label: "Paris Saint-Germain Away 2020-21", confidence: 82 },
    addedAt: "2024-03-30",
  },
  {
    id: "ajax-home-2122",
    team: "Ajax",
    season: "2021-22",
    version: "Home",
    country: "Netherlands",
    league: "Eredivisie",
    manufacturer: "Adidas",
    teamColor: "#d2122e",
    secondaryColor: "#ffffff",
    ai: { label: "Ajax Home 2021-22", confidence: 89 },
    addedAt: "2024-07-08",
  },
  {
    id: "lfc-home-1819",
    team: "Liverpool",
    season: "2018-19",
    version: "Home",
    country: "England",
    league: "Champions League",
    manufacturer: "Nike",
    teamColor: "#c8102e",
    secondaryColor: "#00b2a9",
    notes: "Sixth European Cup. New Balance era, kept the badge clean.",
    ai: { label: "Liverpool Home 2018-19", confidence: 78 },
    addedAt: "2024-02-14",
  },
  {
    id: "rmcf-away-1516",
    team: "Real Madrid",
    season: "2015-16",
    version: "Away",
    country: "Spain",
    league: "Champions League",
    manufacturer: "Adidas",
    teamColor: "#febe10",
    secondaryColor: "#00529f",
    ai: { label: "Real Madrid Away 2015-16", confidence: 73 },
    addedAt: "2023-12-01",
  },
  {
    id: "acm-home-2223",
    team: "AC Milan",
    season: "2022-23",
    version: "Home",
    country: "Italy",
    league: "Serie A",
    manufacturer: "Puma",
    teamColor: "#fb090b",
    secondaryColor: "#000000",
    ai: { label: "AC Milan Home 2022-23", confidence: 90 },
    addedAt: "2024-08-25",
  },
  {
    id: "atm-third-1920",
    team: "Atlético de Madrid",
    season: "2019-20",
    version: "Third",
    country: "Spain",
    league: "LaLiga",
    manufacturer: "Nike",
    teamColor: "#272e61",
    secondaryColor: "#cb3524",
    notes: "Sky-blue away/third, fan favourite.",
    ai: { label: "Atlético de Madrid Third 2019-20", confidence: 68 },
    addedAt: "2024-06-17",
  },
  {
    id: "che-away-1617",
    team: "Chelsea",
    season: "2016-17",
    version: "Away",
    country: "England",
    league: "Premier League",
    manufacturer: "Adidas",
    teamColor: "#ffffff",
    secondaryColor: "#034694",
    ai: { label: "Chelsea Away 2016-17", confidence: 85 },
    addedAt: "2024-01-09",
  },
  {
    id: "inter-home-2021",
    team: "Inter Milan",
    season: "2020-21",
    version: "Home",
    country: "Italy",
    league: "Serie A",
    manufacturer: "Nike",
    teamColor: "#0b1560",
    secondaryColor: "#000000",
    notes: "Scudetto number 19, the snake-print kit.",
    ai: { label: "Inter Milan Home 2020-21", confidence: 92 },
    addedAt: "2024-10-29",
  },
  {
    id: "lfc-gk-2324",
    team: "Liverpool",
    season: "2023-24",
    version: "GK",
    country: "England",
    league: "Premier League",
    manufacturer: "Nike",
    teamColor: "#7ad144",
    secondaryColor: "#1b1b1b",
    ai: { label: "Liverpool Goalkeeper 2023-24", confidence: 64 },
    addedAt: "2024-12-05",
  },
  {
    id: "om-home-1718",
    team: "Olympique de Marseille",
    season: "2017-18",
    version: "Home",
    country: "France",
    league: "Ligue 1",
    manufacturer: "Puma",
    teamColor: "#2faee0",
    secondaryColor: "#ffffff",
    ai: { label: "Olympique de Marseille Home 2017-18", confidence: 80 },
    addedAt: "2023-11-22",
  },
];

/* ------------------------------------------------------------------ */
/* Filter / form option lists                                          */
/* ------------------------------------------------------------------ */

export const COUNTRIES: Country[] = [
  "England",
  "Spain",
  "Italy",
  "Germany",
  "France",
  "Netherlands",
];

export const LEAGUES: League[] = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Eredivisie",
];

export const VERSIONS: ShirtVersion[] = ["Home", "Away", "Third", "GK"];

export const MANUFACTURERS: Manufacturer[] = [
  "Adidas",
  "Nike",
  "Puma",
  "Umbro",
  "Kappa",
  "Other",
];

/** Unique, descending list of seasons present in the collection. */
export const SEASONS: string[] = Array.from(
  new Set(MOCK_SHIRTS.map((s) => s.season)),
).sort((a, b) => b.localeCompare(a));

/**
 * Pretend AI suggestions. The Add-Shirt flow picks one at random after the
 * fake "analyzing" delay to pre-fill the form.
 */
export const MOCK_AI_SUGGESTIONS: Array<{
  team: string;
  season: string;
  version: ShirtVersion;
  country: Country;
  league: League;
  manufacturer: Manufacturer;
  confidence: number;
}> = [
  {
    team: "Tottenham Hotspur",
    season: "2018-19",
    version: "Home",
    country: "England",
    league: "Premier League",
    manufacturer: "Nike",
    confidence: 88,
  },
  {
    team: "Valencia CF",
    season: "2016-17",
    version: "Away",
    country: "Spain",
    league: "LaLiga",
    manufacturer: "Adidas",
    confidence: 71,
  },
  {
    team: "Napoli",
    season: "2022-23",
    version: "Home",
    country: "Italy",
    league: "Serie A",
    manufacturer: "Kappa",
    confidence: 83,
  },
  {
    team: "Bayern Munich",
    season: "2020-21",
    version: "Third",
    country: "Germany",
    league: "Bundesliga",
    manufacturer: "Adidas",
    confidence: 90,
  },
];
