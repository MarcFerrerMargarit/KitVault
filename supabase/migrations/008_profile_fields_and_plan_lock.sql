-- ============================================================
-- KitVault — profile fields, and locking the plan column
--
-- 1) SECURITY FIX. `profiles_update_own` let a user update any column of
--    their own row — including `plan`, added by migration 002. With the
--    public anon key and their own session, anyone could run
--
--        update profiles set plan = 'pro' where id = auth.uid();
--
--    and get unlimited shirts, 100 AI identifications a day and bulk upload
--    for free, since every quota function reads `profiles.plan`.
--
--    RLS decides which *rows* a user may touch; it cannot restrict
--    *columns*. Postgres column privileges can, and they apply on top of RLS.
--    So table-wide UPDATE is revoked and granted back only on the columns a
--    user is meant to edit. The plan stays writable by the security definer
--    functions, which run as the table owner — which is how a payment webhook
--    should set it too.
--
-- 2) The profile page: a short bio, a favourite team and a photo.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) New columns -------------------------------------------------------
alter table public.profiles add column if not exists bio            text;
alter table public.profiles add column if not exists favourite_team text;
-- Path inside the `shirts` bucket, `<uid>/avatar-<uuid>.jpg`. Same bucket and
-- folder as the user's shirt photos on purpose: the storage policies already
-- confine each user to their own folder, and account deletion already empties
-- that folder, so the avatar needs no new rules and cannot be left behind.
alter table public.profiles add column if not exists avatar_path    text;

-- Limits live in the database, not just the form: the form is one client of
-- this table, and the anon key is public.
--
-- The display name defaults to the part of the email before the @, which can
-- be longer than the new limit. Existing rows are trimmed so the constraint
-- can be added, and the signup trigger is changed to trim too — otherwise a
-- long address would make the profile insert, and so the whole signup, fail.
update public.profiles
   set display_name = left(display_name, 40)
 where length(display_name) > 40;

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
    left(
      coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
      40
    )
  );
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_display_name_len') then
    alter table public.profiles add constraint profiles_display_name_len
      check (display_name is null or length(display_name) <= 40);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_bio_len') then
    alter table public.profiles add constraint profiles_bio_len
      check (bio is null or length(bio) <= 280);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_favourite_team_len') then
    alter table public.profiles add constraint profiles_favourite_team_len
      check (favourite_team is null or length(favourite_team) <= 60);
  end if;
  -- An avatar may only point inside the owner's own folder, so the column
  -- cannot be used to make the app sign a URL for somebody else's photo.
  if not exists (select 1 from pg_constraint where conname = 'profiles_avatar_path_own') then
    alter table public.profiles add constraint profiles_avatar_path_own
      check (avatar_path is null or avatar_path like id::text || '/avatar-%');
  end if;
end $$;

-- 2) Only the profile columns are editable ------------------------------
revoke update on public.profiles from anon, authenticated;
grant update (display_name, bio, favourite_team, avatar_path)
  on public.profiles to authenticated;

-- ============================================================
--   -- Check the lock. The SQL Editor runs as an administrator, which would
--   -- pass anyway, so switch to the role the app's users have. The first
--   -- update must fail with "permission denied for table profiles"; nothing
--   -- is changed either way (`where false`, and the rollback).
--   begin;
--   set local role authenticated;
--   update public.profiles set plan = 'pro' where false;
--   rollback;
--
--   -- and this one, a profile field, must succeed:
--   begin;
--   set local role authenticated;
--   update public.profiles set bio = 'x' where false;
--   rollback;
--
--   -- who has edited their profile
--   select email, display_name, favourite_team, avatar_path is not null as has_photo
--     from public.profiles order by created_at desc;
-- ============================================================
