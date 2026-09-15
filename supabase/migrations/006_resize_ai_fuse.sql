-- ============================================================
-- KitVault — resize the app-wide AI fuse
--
-- `ai_limits` holds two numbers that are easy to mistake for a user quota.
-- They are not. The per-user allowance lives in `plan_limits`
-- (`daily_identifications`, free 5 / pro 100) and is counted per `user_id`.
-- These two are a fuse on the *bill*: the ceiling a bug, an abusive account
-- or an unexpectedly good day cannot push past.
--
-- The original values were sized for Gemini's FREE tier, which caps the whole
-- project at roughly 10 requests a minute and 250 a day. Once billing is
-- linked and the project reaches Tier 1 those ceilings rise about fifteenfold,
-- and a fuse left at 150/day trips long before Google's own does.
--
-- Why that matters beyond throughput: `ai_quota_status()` reports
--
--     remaining := least(user_remaining, global_remaining)
--
-- so a fuse running low drags down the number *every* user sees, however
-- little they have spent themselves, and refuses them with `global_quota`.
-- To the person holding the phone that reads as a bug in KitVault, not as a
-- limit of their plan. Keep the fuse comfortably above
-- (expected active users x their daily allowance).
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- Tier 1 (billing linked to the project): Google allows ~150 requests/minute
-- and ~1,000/day. Both values sit under that, so Google's limit stays as the
-- backstop and this one as the budget.
update public.ai_limits
   set global_daily_limit      = 800,
       global_burst_per_minute = 60
 where id;

-- ============================================================
--   -- STILL ON THE FREE TIER? Run this instead. A free project caps out at
--   -- ~250 requests/day and ~10/minute, so a higher fuse would just let
--   -- Google refuse the call before Postgres ever does.
--   update public.ai_limits
--      set global_daily_limit = 200, global_burst_per_minute = 6 where id;
--
--   -- what the fuse is worth, worst case, per day (at ~$0.00073 a call)
--   select global_daily_limit,
--          round((global_daily_limit * 0.00073)::numeric, 2) as usd_per_day
--     from public.ai_limits;
--
--   -- today's real consumption against the fuse
--   select count(*) as used_today,
--          (select global_daily_limit from public.ai_limits) as fuse
--     from public.ai_usage
--    where created_at >= public.ai_day_start()
--      and status = 'success';
-- ============================================================
