-- ============================================================
-- KitVault — collection size per plan + account deletion
--
-- 1) The actual paywall: how many shirts a plan may hold. This is separate
--    from the daily AI quota in 002, which protects the Gemini budget.
-- 2) GDPR: let a user delete their account and everything attached to it.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) Collection size per plan ------------------------------------------
-- NULL means unlimited.
alter table public.plan_limits
  add column if not exists max_shirts int check (max_shirts is null or max_shirts >= 0);

update public.plan_limits set max_shirts = 25 where plan = 'free' and max_shirts is null;
-- 'pro' stays NULL — unlimited.

-- 2) Enforce it in the database ----------------------------------------
-- This has to be a trigger, not a check in the Server Action: users hold a
-- valid session and the anon key, so they can POST straight to PostgREST and
-- insert rows without ever touching our code. RLS lets them (the row is
-- theirs); only the database can hold the paywall.
create or replace function public.enforce_shirt_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan  text;
  v_limit int;
  v_count int;
begin
  select p.plan into v_plan from public.profiles p where p.id = new.user_id;
  v_plan := coalesce(v_plan, 'free');

  select pl.max_shirts into v_limit
    from public.plan_limits pl where pl.plan = v_plan;

  if v_limit is null then
    return new; -- unlimited plan
  end if;

  -- Serialise per user, or two shirts saved at the same moment both see the
  -- last free slot and both get in.
  perform pg_advisory_xact_lock(hashtext('kitvault.shirts:' || new.user_id::text));

  select count(*) into v_count
    from public.shirts s where s.user_id = new.user_id;

  if v_count >= v_limit then
    raise exception 'Collection limit reached: % shirts on the % plan.', v_limit, v_plan
      using errcode = 'KV001';
  end if;

  return new;
end;
$$;

drop trigger if exists shirts_enforce_limit on public.shirts;
create trigger shirts_enforce_limit
  before insert on public.shirts
  for each row execute function public.enforce_shirt_limit();

-- 3) Status for the UI --------------------------------------------------
create or replace function public.collection_limit_status()
returns table (
  plan       text,
  max_shirts int,
  used       int,
  remaining  int
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_plan  text;
  v_limit int;
  v_used  int;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.plan into v_plan from public.profiles p where p.id = v_uid;
  v_plan := coalesce(v_plan, 'free');

  select pl.max_shirts into v_limit
    from public.plan_limits pl where pl.plan = v_plan;

  select count(*) into v_used from public.shirts s where s.user_id = v_uid;

  plan       := v_plan;
  max_shirts := v_limit;                          -- null = unlimited
  used       := v_used;
  remaining  := case when v_limit is null then null
                     else greatest(v_limit - v_used, 0) end;
  return next;
end;
$$;

-- 4) Account deletion ---------------------------------------------------
-- Everything the user owns cascades from auth.users: profiles, shirts,
-- ai_corrections and ai_usage all declare `on delete cascade`. Storage
-- objects do NOT — the app deletes those first, while it can still
-- authenticate as the owner.
--
-- Done as a security definer function rather than with the service_role key
-- so the app never has to hold a credential that bypasses RLS entirely. The
-- function can only ever delete the caller.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = v_uid;
end;
$$;

-- 5) Grants -------------------------------------------------------------
revoke execute on function public.collection_limit_status() from public;
revoke execute on function public.delete_own_account()      from public;

grant execute on function public.collection_limit_status() to authenticated;
grant execute on function public.delete_own_account()      to authenticated;

-- ============================================================
--   -- change the free allowance, or make a plan unlimited
--   update public.plan_limits set max_shirts = 50   where plan = 'free';
--   update public.plan_limits set max_shirts = null where plan = 'pro';
--
-- Existing users over the limit keep every shirt they already have; the
-- trigger only refuses new ones.
-- ============================================================
