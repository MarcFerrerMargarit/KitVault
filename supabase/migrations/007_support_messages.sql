-- ============================================================
-- KitVault — support / feedback inbox
--
-- The help form emails whoever runs the app, but email is a notification, not
-- storage: it can bounce, land in spam or be deleted by accident. Every message
-- is written here first, so the feedback survives whatever happens to the mail.
--
-- Inserting goes through `submit_support_message()` rather than a policy. A
-- form that sends mail is a spam relay if it is not rationed, and doing the
-- count and the insert in one statement is the only way two quick submissions
-- cannot both pass the check.
--
-- Run once in Supabase → SQL Editor. Idempotent: safe to re-run.
-- ============================================================

-- 1) The messages ------------------------------------------------------
create table if not exists public.support_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  category   text not null check (category in ('bug', 'idea', 'question', 'other')),
  -- A floor as well as a ceiling: "no va" is not a bug report, and the form
  -- says so before it lets the message through.
  message    text not null check (length(btrim(message)) between 10 and 4000),
  -- Where they were and in which language, so a report can be reproduced.
  page       text,
  locale     text,
  created_at timestamptz not null default now()
);

create index if not exists support_messages_created_idx
  on public.support_messages (created_at desc);
create index if not exists support_messages_user_created_idx
  on public.support_messages (user_id, created_at desc);

-- 2) Row Level Security ------------------------------------------------
-- Readable by its author only, and never writable directly: the function
-- below is the only way in.
alter table public.support_messages enable row level security;

drop policy if exists "support_messages_select_own" on public.support_messages;
create policy "support_messages_select_own" on public.support_messages
  for select using (auth.uid() = user_id);

-- 3) How many a user may send -----------------------------------------
create table if not exists public.support_limits (
  id                boolean primary key default true check (id),
  -- Generous for anyone with something to say, useless to a script.
  max_per_hour      int not null default 5,
  max_per_day       int not null default 20
);

insert into public.support_limits (id) values (true) on conflict (id) do nothing;

alter table public.support_limits enable row level security;
-- No policy on purpose: only the security definer function reads it.

-- 4) Submit ------------------------------------------------------------
-- Returns `allowed = false` with a reason instead of raising, so the form can
-- tell the user to come back later rather than showing them a database error.
create or replace function public.submit_support_message(
  p_category text,
  p_message  text,
  p_page     text default null,
  p_locale   text default null
)
returns table (
  allowed    boolean,
  reason     text,
  message_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_limits    public.support_limits%rowtype;
  v_last_hour int;
  v_last_day  int;
  v_id        uuid;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Serialise check-then-insert per user, so two submissions landing together
  -- cannot both read the same count and both pass.
  perform pg_advisory_xact_lock(hashtext('kitvault.support:' || v_uid::text));

  select * into v_limits from public.support_limits where id;

  select count(*) into v_last_hour
    from public.support_messages m
   where m.user_id = v_uid
     and m.created_at > now() - interval '1 hour';

  if v_last_hour >= v_limits.max_per_hour then
    return query select false, 'rate_limit_hour'::text, null::uuid;
    return;
  end if;

  select count(*) into v_last_day
    from public.support_messages m
   where m.user_id = v_uid
     and m.created_at > now() - interval '1 day';

  if v_last_day >= v_limits.max_per_day then
    return query select false, 'rate_limit_day'::text, null::uuid;
    return;
  end if;

  insert into public.support_messages (user_id, category, message, page, locale)
  values (v_uid, p_category, btrim(p_message), p_page, p_locale)
  returning id into v_id;

  return query select true, 'ok'::text, v_id;
end;
$$;

-- 5) Grants ------------------------------------------------------------
revoke execute on function
  public.submit_support_message(text, text, text, text) from public;
grant execute on function
  public.submit_support_message(text, text, text, text) to authenticated;

-- ============================================================
--   -- everything people have written, newest first
--   select m.created_at, u.email, m.category, m.page, m.message
--     from public.support_messages m
--     join auth.users u on u.id = m.user_id
--    order by m.created_at desc;
--
--   -- what they are writing about
--   select category, count(*) from public.support_messages group by 1 order by 2 desc;
--
--   -- loosen or tighten the ration
--   update public.support_limits set max_per_hour = 10, max_per_day = 40;
-- ============================================================
