-- ============================================================
-- KitVault — plan features + public pricing
--
-- 1) `bulk_upload`: the paid perk. Adding several shirts in one pass.
-- 2) `price_monthly_eur`: so the landing page quotes the real numbers instead
--    of hardcoded copy that drifts the first time a limit changes.
-- 3) Let anonymous visitors read the plan catalogue, for that pricing section.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) New plan columns ---------------------------------------------------
alter table public.plan_limits
  add column if not exists bulk_upload boolean not null default false;

alter table public.plan_limits
  add column if not exists price_monthly_eur numeric(6, 2) not null default 0
  check (price_monthly_eur >= 0);

-- Marketing copy, per plan. Kept in the database for the same reason as the
-- numbers: the landing page should never disagree with what is enforced.
alter table public.plan_limits
  add column if not exists tagline text;

alter table public.plan_limits
  add column if not exists sort_order int not null default 0;

update public.plan_limits
   set bulk_upload = true
 where plan = 'pro' and bulk_upload = false;

-- PLACEHOLDER PRICE — set this to whatever you actually charge before launch.
update public.plan_limits
   set price_monthly_eur = 4.99
 where plan = 'pro' and price_monthly_eur = 0;

update public.plan_limits
   set tagline = 'Everything you need to start cataloguing.',
       sort_order = 1
 where plan = 'free' and tagline is null;

update public.plan_limits
   set tagline = 'For collections that keep growing.',
       sort_order = 2
 where plan = 'pro' and tagline is null;

-- 2) Public read --------------------------------------------------------
-- The plan catalogue is marketing copy: prices and allowances that anyone
-- visiting the landing page should see. Nothing here is user data.
drop policy if exists "plan_limits_select_all" on public.plan_limits;
create policy "plan_limits_select_all" on public.plan_limits
  for select to anon, authenticated using (true);

-- 3) Report the feature flag alongside the limits ------------------------
-- Adding an OUT parameter changes the function's return row type, which
-- `create or replace` refuses ("cannot change return type of existing
-- function"). It has to be dropped first.
drop function if exists public.collection_limit_status();

create function public.collection_limit_status()
returns table (
  plan        text,
  max_shirts  int,
  used        int,
  remaining   int,
  bulk_upload boolean
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
  v_bulk  boolean;
  v_used  int;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.plan into v_plan from public.profiles p where p.id = v_uid;
  v_plan := coalesce(v_plan, 'free');

  select pl.max_shirts, pl.bulk_upload into v_limit, v_bulk
    from public.plan_limits pl where pl.plan = v_plan;

  select count(*) into v_used from public.shirts s where s.user_id = v_uid;

  plan        := v_plan;
  max_shirts  := v_limit;                         -- null = unlimited
  used        := v_used;
  remaining   := case when v_limit is null then null
                      else greatest(v_limit - v_used, 0) end;
  bulk_upload := coalesce(v_bulk, false);
  return next;
end;
$$;

revoke execute on function public.collection_limit_status() from public;
grant execute on function public.collection_limit_status() to authenticated;

-- ============================================================
--   -- set your real price
--   update public.plan_limits set price_monthly_eur = 3.99 where plan = 'pro';
--
--   -- give bulk upload to everyone, or take it away
--   update public.plan_limits set bulk_upload = true where plan = 'free';
-- ============================================================
