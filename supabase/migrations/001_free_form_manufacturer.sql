-- Make `manufacturer` free-form text (any brand, lower divisions, none…).
-- Run once in Supabase → SQL Editor. Idempotent: only converts if it is still
-- an enum, so it is safe whether or not you ran any earlier manufacturer SQL.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'shirts'
      and column_name = 'manufacturer'
      and udt_name = 'manufacturer'
  ) then
    alter table public.shirts alter column manufacturer drop default;
    alter table public.shirts
      alter column manufacturer type text using manufacturer::text;
    alter table public.shirts alter column manufacturer set default 'Other';
  end if;
end $$;

-- Remove the now-unused enum type (no-op if it is already gone).
drop type if exists manufacturer;
