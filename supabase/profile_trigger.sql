-- Run this in the Supabase SQL Editor.
-- Replaces the client-side profile insert in AuthContext.jsx's signup(),
-- which fails whenever email confirmation is required (no active session
-- exists yet at signup time, so the RLS policy on profiles blocks it).
-- This trigger runs server-side with elevated privileges, so it works
-- regardless of confirmation status.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- One-time backfill: if you already tried signing up before this trigger
-- existed, that user's auth.users row exists but has no matching profile.
-- This creates one for anyone currently missing it.
insert into public.profiles (id, full_name)
select id, raw_user_meta_data->>'full_name'
from auth.users
where id not in (select id from public.profiles);