-- Migration 0005 — agent_api_keys
-- API keys issued by users (from dashboard, after wallet login) for use by their AI Agent.
-- Each key is bound to one user; only one active key per user is allowed at a time
-- (regenerate revokes the previous active key).

create table if not exists public.agent_api_keys (
  id            bigint generated always as identity primary key,
  uuid          uuid not null unique default gen_random_uuid(),
  user_id       bigint not null references public.users (id) on delete cascade,
  key_prefix    text not null,
  key_hash      text not null,
  label         text,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

create index if not exists agent_api_keys_uuid_idx       on public.agent_api_keys (uuid);
create index if not exists agent_api_keys_user_id_idx    on public.agent_api_keys (user_id);
create index if not exists agent_api_keys_key_prefix_idx on public.agent_api_keys (key_prefix);

-- Enforce: at most one active (non-revoked) key per user.
create unique index if not exists agent_api_keys_one_active_per_user_uidx
  on public.agent_api_keys (user_id)
  where revoked_at is null;