-- Migration 0006 — Lock down all tables to BE-only access.
--
-- Strategy:
--   1. Enable Row Level Security on every table.
--   2. Do NOT create any policies. Without policies, `anon` and `authenticated`
--      roles (the ones PostgREST exposes publicly via Supabase URL) get zero
--      access — every SELECT/INSERT/UPDATE/DELETE returns empty / errors.
--   3. The Express BE uses the `service_role` key, which bypasses RLS, so it
--      retains full access through `@supabase/supabase-js`.
--
-- Defense-in-depth: explicitly REVOKE table privileges from anon & authenticated
-- so even an RLS-policy added later by mistake cannot accidentally open access.

alter table public.user_providers       enable row level security;
alter table public.users                enable row level security;
alter table public.quests               enable row level security;
alter table public.quest_participations enable row level security;
alter table public.agent_api_keys       enable row level security;

-- Belt + suspenders: strip privileges so anon/authenticated cannot even attempt access.
revoke all on public.user_providers       from anon, authenticated;
revoke all on public.users                from anon, authenticated;
revoke all on public.quests               from anon, authenticated;
revoke all on public.quest_participations from anon, authenticated;
revoke all on public.agent_api_keys       from anon, authenticated;

-- Also lock down future tables created in `public` schema by default — any new
-- table will inherit no privileges for anon/authenticated unless explicitly granted.
alter default privileges in schema public revoke all on tables from anon, authenticated;
