-- Migration 0003 — quests
-- Quests are immutable after creation. Visibility is controlled purely by expires_at.

create table if not exists public.quests (
  id             bigint generated always as identity primary key,
  uuid           uuid not null unique default gen_random_uuid(),
  provider_id    bigint not null references public.user_providers (id) on delete cascade,
  title          text not null,
  description    text not null,
  protocol       text not null check (protocol in ('byreal', 'bybit', 'sui')),
  quest_type     text not null check (quest_type in ('swap', 'lp', 'stake')),
  action_params  jsonb not null,
  reward_amount  numeric not null check (reward_amount >= 0),
  reward_token   text not null,
  expires_at     timestamptz not null,
  created_at     timestamptz not null default now()
);

create index if not exists quests_uuid_idx        on public.quests (uuid);
create index if not exists quests_provider_id_idx on public.quests (provider_id);
create index if not exists quests_expires_at_idx  on public.quests (expires_at);
create index if not exists quests_protocol_idx    on public.quests (protocol);
create index if not exists quests_quest_type_idx  on public.quests (quest_type);