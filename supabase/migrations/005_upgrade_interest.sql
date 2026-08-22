-- ============================================================
-- KitVault — upgrade waiting list
--
-- Payments are not wired up yet, so the Upgrade button records interest
-- instead of taking money. That turns a dead end into the one number worth
-- having before paying for Vercel Pro and Supabase Pro: how many people
-- actually want the paid plan.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- One row per user: the primary key makes "already on the list" free to
-- express, and an upsert idempotent.
create table if not exists public.upgrade_interest (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  plan       text not null default 'pro' references public.plan_limits (plan),
  created_at timestamptz not null default now()
);

alter table public.upgrade_interest enable row level security;

drop policy if exists "upgrade_interest_select_own" on public.upgrade_interest;
create policy "upgrade_interest_select_own" on public.upgrade_interest
  for select using (auth.uid() = user_id);

drop policy if exists "upgrade_interest_insert_own" on public.upgrade_interest;
create policy "upgrade_interest_insert_own" on public.upgrade_interest
  for insert with check (auth.uid() = user_id);

drop policy if exists "upgrade_interest_delete_own" on public.upgrade_interest;
create policy "upgrade_interest_delete_own" on public.upgrade_interest
  for delete using (auth.uid() = user_id);

-- ============================================================
--   -- who is waiting, newest first
--   select u.email, i.created_at
--     from public.upgrade_interest i
--     join auth.users u on u.id = i.user_id
--    order by i.created_at desc;
--
--   -- how many
--   select count(*) from public.upgrade_interest;
-- ============================================================
