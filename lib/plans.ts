import { createPublicClient } from "@/lib/supabase/public";

/**
 * Whether a paid plan can actually be bought yet.
 *
 * While this is false, paid plans are shown but greyed out and their call to
 * action joins the waiting list instead of pretending to sell. Flip it once a
 * checkout exists — it is the only switch that needs changing.
 */
export const PAYMENTS_ENABLED = false;

/** A plan as advertised on the landing page. */
export interface Plan {
  id: string;
  label: string;
  tagline: string | null;
  priceMonthlyEur: number;
  /** `null` means unlimited. */
  maxShirts: number | null;
  dailyIdentifications: number;
  bulkUpload: boolean;
}

interface PlanRow {
  plan: string;
  label: string;
  tagline: string | null;
  price_monthly_eur: number | string;
  max_shirts: number | null;
  daily_identifications: number;
  bulk_upload: boolean;
  sort_order: number;
}

/**
 * Fallback used when the database cannot be reached, so the landing page never
 * renders without a pricing table. Mirrors the migration defaults.
 */
const FALLBACK: Plan[] = [
  {
    id: "free",
    label: "Free",
    tagline: "Everything you need to start cataloguing.",
    priceMonthlyEur: 0,
    maxShirts: 25,
    dailyIdentifications: 5,
    bulkUpload: false,
  },
  {
    id: "pro",
    label: "Pro",
    tagline: "For collections that keep growing.",
    priceMonthlyEur: 4.99,
    maxShirts: null,
    dailyIdentifications: 100,
    bulkUpload: true,
  },
];

/**
 * The public plan catalogue, straight from `plan_limits` — the same rows the
 * database enforces, so the pricing table cannot drift from reality.
 */
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("plan_limits")
      .select(
        "plan,label,tagline,price_monthly_eur,max_shirts,daily_identifications,bulk_upload,sort_order",
      )
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK;

    return (data as PlanRow[]).map((row) => ({
      id: row.plan,
      label: row.label,
      tagline: row.tagline,
      priceMonthlyEur: Number(row.price_monthly_eur),
      maxShirts: row.max_shirts,
      dailyIdentifications: row.daily_identifications,
      bulkUpload: row.bulk_upload,
    }));
  } catch {
    return FALLBACK;
  }
}

/** The bullet list shown under a plan's price. */
export function planPerks(plan: Plan): string[] {
  return [
    plan.maxShirts === null
      ? "Unlimited shirts"
      : `Up to ${plan.maxShirts} shirts`,
    `${plan.dailyIdentifications} AI identifications a day`,
    plan.bulkUpload
      ? "Bulk upload — add a whole batch at once"
      : "Add shirts one at a time",
    "Interactive collection map",
    "Filters, search and collection stats",
  ];
}
