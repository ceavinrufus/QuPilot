-- Migration 0009 — merge user_providers into users
--
-- Changes:
-- - users: add role + provider profile fields (display_name, logo_url)
-- - quests.provider_id: FK now points to users(id)
-- - drop user_providers table (deprecated)

alter table public.users
  add column if not exists role text not null default 'user';

alter table public.users
  add column if not exists display_name text;

alter table public.users
  add column if not exists logo_url text;

alter table public.users
  drop constraint if exists users_role_check;
alter table public.users
  add constraint users_role_check check (role in ('user', 'user_provider'));

alter table public.quests
  drop constraint if exists quests_provider_id_fkey;
alter table public.quests
  add constraint quests_provider_id_fkey
    foreign key (provider_id) references public.users (id) on delete cascade;

drop table if exists public.user_providers;
