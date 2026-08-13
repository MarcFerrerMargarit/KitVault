-- ============================================================
-- KitVault — Phase 3.5: AI identification quota
--
-- Two independent limits protect the single shared GEMINI_API_KEY:
--   1. a global daily cap + per-minute burst guard for the whole app
--      (Gemini rate limits are applied per project, not per key)
--   2. a per-user daily quota driven by the user's plan
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) Plans --------------------------------------------------------------
create table if not exists public.plan_limits (
  plan                  text primary key,
  label                 text not null,
  daily_identifications int  not null check (daily_identifications >= 0)
);

insert into public.plan_limits (plan, label, daily_identifications) values
  ('free', 'Free', 5),
  ('pro',  'Pro',  100)
on conflict (plan) do nothing;

alter table public.profiles
  add column if not exists plan text not null default 'free';

-- Guard the column with a foreign key (added separately so re-runs are safe).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_plan_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_plan_fkey
      foreign key (plan) references public.plan_limits (plan);
  end if;
end $$;

-- 2) App-wide limits (single row) ---------------------------------------
create table if not exists public.ai_limits (
  id                      boolean primary key default true check (id),
  -- Keep this comfortably below the project's Gemini requests-per-day.
  global_daily_limit      int  not null default 150,
  -- Gemini's free tier allows ~10 requests/minute for the whole project.
  global_burst_per_minute int  not null default 6,
  -- Timezone the daily counters reset in.
  reset_timezone          text not null default 'Europe/Madrid'
);

insert into public.ai_limits (id) values (true) on conflict (id) do nothing;

-- 3) Usage ledger -------------------------------------------------------
-- One row per identification: it is both the quota counter and the cost
-- ledger. A row is inserted as `pending` before calling Gemini, then either
-- promoted to `success` with the real token counts or marked `failed`.
create table if not exists public.ai_usage (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  model         text,
  status        text not null default 'pending'
                check (status in ('pending', 'success', 'failed')),
  input_tokens  int,
  output_tokens int,
  total_tokens  int,
  created_at    timestamptz not null default now()
);

create index if not exists ai_usage_user_created_idx
  on public.ai_usage (user_id, created_at desc);
create index if not exists ai_usage_created_idx
  on public.ai_usage (created_at desc);

-- 4) Row Level Security -------------------------------------------------
-- Users may read their own usage and the plan catalogue. Nobody writes to
-- these tables directly: every mutation goes through the security definer
-- functions below, so a user cannot grant themselves credit.
alter table public.ai_usage    enable row level security;
alter table public.ai_limits   enable row level security;
alter table public.plan_limits enable row level security;

drop policy if exists "ai_usage_select_own" on public.ai_usage;
create policy "ai_usage_select_own" on public.ai_usage
  for select using (auth.uid() = user_id);

drop policy if exists "plan_limits_select_all" on public.plan_limits;
create policy "plan_limits_select_all" on public.plan_limits
  for select to authenticated using (true);

-- `ai_limits` intentionally has no policy: only the functions can read it.

-- 5) Helpers ------------------------------------------------------------

-- Start of the current quota day, in the configured timezone.
create or replace function public.ai_day_start()
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select date_trunc('day', now() at time zone l.reset_timezone)
           at time zone l.reset_timezone
  from public.ai_limits l
  where l.id;
$$;

-- 6) Quota status (read-only) -------------------------------------------
-- What counts against the quota: successful calls, plus in-flight ones. A
-- `pending` row older than 5 minutes belongs to a request that died and is
-- ignored, so a crash cannot burn a user's credit forever.
create or replace function public.ai_quota_status()
returns table (
  plan             text,
  user_limit       int,
  user_used        int,
  user_remaining   int,
  global_limit     int,
  global_used      int,
  global_remaining int,
  remaining        int,
  resets_at        timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_day_start timestamptz;
  v_limits    public.ai_limits%rowtype;
  v_plan      text;
  v_user_lim  int;
  v_user_used int;
  v_glob_used int;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_limits from public.ai_limits where id;
  v_day_start := public.ai_day_start();

  select p.plan into v_plan from public.profiles p where p.id = v_uid;
  v_plan := coalesce(v_plan, 'free');

  select pl.daily_identifications into v_user_lim
    from public.plan_limits pl where pl.plan = v_plan;
  v_user_lim := coalesce(v_user_lim, 0);

  select count(*) into v_user_used
    from public.ai_usage u
   where u.user_id = v_uid
     and u.created_at >= v_day_start
     and (
       u.status = 'success'
       or (u.status = 'pending' and u.created_at > now() - interval '5 minutes')
     );

  select count(*) into v_glob_used
    from public.ai_usage u
   where u.created_at >= v_day_start
     and (
       u.status = 'success'
       or (u.status = 'pending' and u.created_at > now() - interval '5 minutes')
     );

  plan             := v_plan;
  user_limit       := v_user_lim;
  user_used        := v_user_used;
  user_remaining   := greatest(v_user_lim - v_user_used, 0);
  global_limit     := v_limits.global_daily_limit;
  global_used      := v_glob_used;
  global_remaining := greatest(v_limits.global_daily_limit - v_glob_used, 0);
  remaining        := least(user_remaining, global_remaining);
  resets_at        := v_day_start + interval '1 day';
  return next;
end;
$$;

-- 7) Consume one credit -------------------------------------------------
-- Checks every limit and inserts the reservation row in one transaction.
-- Returns `allowed = false` with a reason instead of raising, so the app can
-- fall back to manual entry.
create or replace function public.consume_ai_credit(p_model text default null)
returns table (
  allowed   boolean,
  reason    text,
  usage_id  uuid,
  remaining int,
  resets_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_status record;
  v_limits public.ai_limits%rowtype;
  v_burst  int;
  v_id     uuid;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Serialise the check-then-insert. Without this, two uploads landing at the
  -- same moment both read the same count and both spend the last credit.
  perform pg_advisory_xact_lock(hashtext('kitvault.ai_quota'));

  select * into v_limits from public.ai_limits where id;
  select * into v_status from public.ai_quota_status();

  if v_status.global_remaining <= 0 then
    return query select false, 'global_quota'::text, null::uuid, 0, v_status.resets_at;
    return;
  end if;

  if v_status.user_remaining <= 0 then
    return query select false, 'user_quota'::text, null::uuid, 0, v_status.resets_at;
    return;
  end if;

  select count(*) into v_burst
    from public.ai_usage u
   where u.created_at > now() - interval '1 minute'
     and u.status <> 'failed';

  if v_burst >= v_limits.global_burst_per_minute then
    return query select false, 'burst'::text, null::uuid,
                        v_status.remaining, v_status.resets_at;
    return;
  end if;

  insert into public.ai_usage (user_id, model)
  values (v_uid, p_model)
  returning id into v_id;

  return query select true, 'ok'::text, v_id,
                      v_status.remaining - 1, v_status.resets_at;
end;
$$;

-- 8) Settle a reservation -----------------------------------------------
create or replace function public.record_ai_usage(
  p_usage_id uuid,
  p_input    int,
  p_output   int,
  p_total    int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_usage
     set status        = 'success',
         input_tokens  = p_input,
         output_tokens = p_output,
         total_tokens  = p_total
   where id = p_usage_id
     and user_id = auth.uid()
     and status = 'pending';
end;
$$;

-- Give the credit back when Gemini fails: the user should not pay for our
-- errors, and a failed call bills nothing.
create or replace function public.release_ai_credit(p_usage_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_usage
     set status = 'failed'
   where id = p_usage_id
     and user_id = auth.uid()
     and status = 'pending';
end;
$$;

-- 9) Grants -------------------------------------------------------------
revoke execute on function public.ai_day_start()                    from public;
revoke execute on function public.ai_quota_status()                 from public;
revoke execute on function public.consume_ai_credit(text)           from public;
revoke execute on function public.record_ai_usage(uuid, int, int, int) from public;
revoke execute on function public.release_ai_credit(uuid)           from public;

grant execute on function public.ai_quota_status()                  to authenticated;
grant execute on function public.consume_ai_credit(text)            to authenticated;
grant execute on function public.record_ai_usage(uuid, int, int, int) to authenticated;
grant execute on function public.release_ai_credit(uuid)            to authenticated;

-- ============================================================
-- Handy admin queries (run as the SQL Editor's postgres role):
--
--   -- today's spend, per user
--   select u.user_id, count(*) filter (where u.status = 'success') as calls,
--          sum(u.total_tokens) as tokens
--     from public.ai_usage u
--    where u.created_at >= public.ai_day_start()
--    group by u.user_id order by calls desc;
--
--   -- upgrade someone to the paid plan
--   update public.profiles set plan = 'pro' where email = 'someone@example.com';
--
--   -- change the limits without a redeploy
--   update public.plan_limits set daily_identifications = 10 where plan = 'free';
--   update public.ai_limits    set global_daily_limit = 200 where id;
-- ============================================================
