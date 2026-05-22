-- Migration 0004 — quest_participations
-- Records of quest executions performed by AI agents on behalf of users.
-- Partial unique index enforces: at most one `inprogress` row per (user, quest).

create table if not exists public.quest_participations (
  id              bigint generated always as identity primary key,
  uuid            uuid not null unique default gen_random_uuid(),
  user_id         bigint not null references public.users  (id) on delete cascade,
  quest_id        bigint not null references public.quests (id) on delete cascade,
  status          text not null check (status in ('inprogress', 'success', 'failed')),
  tx_hash         text,
  reward_claimed  boolean not null default false,
  started_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists quest_participations_uuid_idx     on public.quest_participations (uuid);
create index if not exists quest_participations_user_id_idx  on public.quest_participations (user_id);
create index if not exists quest_participations_quest_id_idx on public.quest_participations (quest_id);
create index if not exists quest_participations_status_idx   on public.quest_participations (status);

-- Enforce: only one inprogress participation per (user, quest) at a time.
create unique index if not exists quest_participations_one_inprogress_uidx
  on public.quest_participations (user_id, quest_id)
  where status = 'inprogress';