-- ============================================================
-- KitVault — Phase 2 database schema
-- Paste into Supabase Dashboard → SQL Editor and run.
-- Safe to run on a fresh project. Order matters; run top to bottom.
-- ============================================================

-- 1) Enums --------------------------------------------------------------
-- Only the kit version is a closed set. Country, league and manufacturer are
-- free-form text so the AI (or the user) can enter any real-world value.
create type shirt_version as enum ('Home', 'Away', 'Third', 'GK');

-- 2) profiles (1 row per auth user) -------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now()
);

-- 3) shirts -------------------------------------------------------------
create table public.shirts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  team             text not null,
  season           text not null,
  version          shirt_version not null default 'Home',
  country          text,
  league           text,
  manufacturer     text not null default 'Other',
  team_color       text,
  secondary_color  text,
  notes            text,
  image_path       text,                       -- path inside the `shirts` storage bucket
  ai_label         text,
  ai_confidence    int check (ai_confidence between 0 and 100),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index shirts_user_id_idx on public.shirts (user_id);

-- 4) ai_corrections (feedback to improve the model) ---------------------
create table public.ai_corrections (
  id          uuid primary key default gen_random_uuid(),
  shirt_id    uuid references public.shirts (id) on delete set null,
  user_id     uuid not null references auth.users (id) on delete cascade,
  image_path  text,
  predicted   jsonb not null,   -- original AI prediction
  corrected   jsonb not null,   -- values the user saved
  created_at  timestamptz not null default now()
);
create index ai_corrections_user_id_idx on public.ai_corrections (user_id);

-- 5) keep shirts.updated_at fresh ---------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shirts_set_updated_at
  before update on public.shirts
  for each row execute function public.set_updated_at();

-- 6) auto-create a profile row when a user signs up ---------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7) Row Level Security -------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.shirts         enable row level security;
alter table public.ai_corrections enable row level security;

-- profiles: owner only
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- shirts: full CRUD on own rows
create policy "shirts_select_own" on public.shirts
  for select using (auth.uid() = user_id);
create policy "shirts_insert_own" on public.shirts
  for insert with check (auth.uid() = user_id);
create policy "shirts_update_own" on public.shirts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "shirts_delete_own" on public.shirts
  for delete using (auth.uid() = user_id);

-- ai_corrections: read + insert own
create policy "corrections_select_own" on public.ai_corrections
  for select using (auth.uid() = user_id);
create policy "corrections_insert_own" on public.ai_corrections
  for insert with check (auth.uid() = user_id);

-- 8) Storage bucket for shirt photos ------------------------------------
insert into storage.buckets (id, name, public)
values ('shirts', 'shirts', false)
on conflict (id) do nothing;

-- Files are stored under a folder named with the user's uid: `<uid>/<file>`
create policy "shirt_images_select_own" on storage.objects
  for select using (
    bucket_id = 'shirts' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "shirt_images_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'shirts' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "shirt_images_update_own" on storage.objects
  for update using (
    bucket_id = 'shirts' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "shirt_images_delete_own" on storage.objects
  for delete using (
    bucket_id = 'shirts' and (storage.foldername(name))[1] = auth.uid()::text
  );
