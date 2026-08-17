import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * How many AI identifications the signed-in user has left today.
 *
 * `remaining` is the number the UI should show: the lower of the user's own
 * plan allowance and what is left of the app-wide daily cap, since either one
 * can block the next identification.
 */
export interface QuotaStatus {
  plan: string;
  userLimit: number;
  userUsed: number;
  userRemaining: number;
  globalLimit: number;
  globalUsed: number;
  globalRemaining: number;
  remaining: number;
  /** ISO timestamp of the next daily reset. */
  resetsAt: string;
}

/** Row shape returned by the `ai_quota_status()` Postgres function. */
interface QuotaRow {
  plan: string;
  user_limit: number;
  user_used: number;
  user_remaining: number;
  global_limit: number;
  global_used: number;
  global_remaining: number;
  remaining: number;
  resets_at: string;
}

function rowToQuota(row: QuotaRow): QuotaStatus {
  return {
    plan: row.plan,
    userLimit: row.user_limit,
    userUsed: row.user_used,
    userRemaining: row.user_remaining,
    globalLimit: row.global_limit,
    globalUsed: row.global_used,
    globalRemaining: row.global_remaining,
    remaining: row.remaining,
    resetsAt: row.resets_at,
  };
}

/**
 * Read the current user's quota. Works with the server or the browser client.
 * Returns `null` if it cannot be read (e.g. the migration has not been run) —
 * callers treat that as "unknown" and simply hide the counter rather than
 * blocking the user.
 */
export async function fetchQuota(
  supabase: SupabaseClient,
): Promise<QuotaStatus | null> {
  const { data, error } = await supabase.rpc("ai_quota_status").single();
  if (error || !data) return null;
  return rowToQuota(data as QuotaRow);
}

/**
 * How large the user's collection may get. This is the paywall proper — the
 * AI quota above only rations Gemini calls.
 */
export interface CollectionLimit {
  plan: string;
  /** `null` means unlimited. */
  maxShirts: number | null;
  used: number;
  /** `null` when unlimited. */
  remaining: number | null;
  /** Whether the plan may add several shirts in one pass. */
  bulkUpload: boolean;
}

interface CollectionLimitRow {
  plan: string;
  max_shirts: number | null;
  used: number;
  remaining: number | null;
  bulk_upload: boolean | null;
}

/** Read the current user's collection allowance. `null` if unreadable. */
export async function fetchCollectionLimit(
  supabase: SupabaseClient,
): Promise<CollectionLimit | null> {
  const { data, error } = await supabase
    .rpc("collection_limit_status")
    .single();
  if (error || !data) return null;
  const row = data as CollectionLimitRow;
  return {
    plan: row.plan,
    maxShirts: row.max_shirts,
    used: row.used,
    remaining: row.remaining,
    bulkUpload: row.bulk_upload ?? false,
  };
}

/**
 * SQLSTATE raised by the `shirts_enforce_limit` trigger, so the app can tell
 * "your collection is full" apart from a genuine database error.
 */
export const COLLECTION_FULL_CODE = "KV001";

/** Why an identification was refused. */
export type QuotaDenialReason = "user_quota" | "global_quota" | "burst";

/** User-facing copy for each refusal, in one place so route and UI agree. */
export function quotaDenialMessage(
  reason: QuotaDenialReason,
  quota: QuotaStatus | null,
): string {
  switch (reason) {
    case "user_quota":
      return `You've used all ${quota?.userLimit ?? 0} AI identifications for today. Fill the details in manually, or come back tomorrow.`;
    case "global_quota":
      return "KitVault has reached today's shared AI limit. Fill the details in manually, or try again tomorrow.";
    case "burst":
      return "Too many identifications happening at once. Wait a minute and try again, or fill the details in manually.";
  }
}
