-- ============================================================
-- KitVault — public vaults: share your collection by link
--
-- Off by default. A collection becomes visible at kitvault.dev/u/<username>
-- only when its owner picks a username and switches it on, and goes private
-- again the moment they switch it off. Nothing about anyone who has not opted
-- in changes.
--
-- What a public vault shows: display name, photo, bio, favourite team, and
-- each shirt's team, season, version, country, league, manufacturer and
-- photos. What it never shows: the email address, shirt notes (they can be
-- personal — a price paid, who gave it), and anything about the AI.
--
-- Shape of the change:
--   1. `username` and `is_public` on profiles, editable by the owner.
--   2. `public_vault(username)`, a security definer function that returns the
--      safe columns of a public vault and nothing for a private one. The
--      tables' own RLS is left exactly as it was — no anonymous read policy on
--      `profiles` or `shirts` — so a mistake in a policy cannot leak a private
--      collection; the function is the only door, and it is easy to audit.
--   3. A storage policy letting anyone read the photos in a public owner's
--      folder, so the page can sign URLs for them without a service key.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) Columns -------------------------------------------------------------
alter table public.profiles add column if not exists username  text;
alter table public.profiles add column if not exists is_public boolean not null default false;

create unique index if not exists profiles_username_key on public.profiles (username);

do $$
begin
  -- 3-24 characters of a-z, 0-9, "_" and "-", starting and ending with a
  -- letter or digit. Stored lowercase, so uniqueness is case-insensitive.
  if not exists (select 1 from pg_constraint where conname = 'profiles_username_format') then
    alter table public.profiles add constraint profiles_username_format
      check (username is null or username ~ '^[a-z0-9][a-z0-9_-]{1,22}[a-z0-9]$');
  end if;
  -- Words that are, or may become, routes or that would impersonate the app.
  if not exists (select 1 from pg_constraint where conname = 'profiles_username_reserved') then
    alter table public.profiles add constraint profiles_username_reserved
      check (username is null or username not in (
        'admin', 'administrator', 'api', 'app', 'auth', 'billing', 'blog',
        'collection', 'contact', 'dashboard', 'help', 'hola', 'kitvault',
        'login', 'logout', 'me', 'moderator', 'null', 'official', 'privacy',
        'profile', 'root', 'settings', 'signup', 'staff', 'support', 'system',
        'team', 'terms', 'undefined', 'upgrade', 'user', 'users', 'www'
      ));
  end if;
  -- A vault cannot be public without an address to find it at.
  if not exists (select 1 from pg_constraint where conname = 'profiles_public_needs_username') then
    alter table public.profiles add constraint profiles_public_needs_username
      check (not is_public or username is not null);
  end if;
end $$;

-- The owner may edit both; `plan` stays locked (see migration 008).
grant update (username, is_public) on public.profiles to authenticated;

-- 2) Reading a public vault ----------------------------------------------
-- Returns null for an unknown username and for a private vault alike, so the
-- page cannot be used to learn which usernames exist behind a private switch.
create or replace function public.public_vault(p_username text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'username',       p.username,
      'display_name',   p.display_name,
      'bio',            p.bio,
      'favourite_team', p.favourite_team,
      'avatar_path',    p.avatar_path,
      'created_at',     p.created_at
    ),
    'shirts', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id',              s.id,
               'team',            s.team,
               'season',          s.season,
               'version',         s.version,
               'country',         s.country,
               'league',          s.league,
               'manufacturer',    s.manufacturer,
               'team_color',      s.team_color,
               'secondary_color', s.secondary_color,
               'image_path',      s.image_path,
               'created_at',      s.created_at
             ) order by s.created_at desc)
        from public.shirts s
       where s.user_id = p.id
    ), '[]'::jsonb)
  )
    from public.profiles p
   where p.username = lower(p_username)
     and p.is_public;
$$;

revoke execute on function public.public_vault(text) from public;
grant execute on function public.public_vault(text) to anon, authenticated;

-- 3) Photos --------------------------------------------------------------
-- Storage policies run with the caller's rights, and an anonymous visitor
-- cannot read `profiles`, so the "is this owner public?" question is asked
-- through a security definer helper.
create or replace function public.vault_is_public(p_owner text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
     where p.id::text = p_owner and p.is_public
  );
$$;

revoke execute on function public.vault_is_public(text) from public;
grant execute on function public.vault_is_public(text) to anon, authenticated;

drop policy if exists "shirt_images_select_public" on storage.objects;
create policy "shirt_images_select_public" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'shirts'
    and public.vault_is_public((storage.foldername(name))[1])
  );

-- ============================================================
--   -- who has gone public
--   select username, display_name,
--          (select count(*) from public.shirts s where s.user_id = p.id) as shirts
--     from public.profiles p where p.is_public order by username;
--
--   -- what a visitor gets for a username (null when private or unknown)
--   select public.public_vault('marc');
--
--   -- switching a vault off stops new photo links at once; links already
--   -- handed out stay valid until they expire (one hour).
-- ============================================================
