import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for public, unauthenticated reads (the landing page's
 * pricing table).
 *
 * Deliberately not the cookie-aware server client: touching cookies would opt
 * the landing page out of static rendering. This one has no session, so the
 * page can stay prerendered and revalidate on a timer.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
