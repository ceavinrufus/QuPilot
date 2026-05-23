-- Migration 0008 — split quest reward into pool + per-user + distributed (all bigint)
--
-- Changes to public.quests:
-- 1. reward_amount (numeric) → reward_per_user (bigint). Reward yang diterima per user
--    yang berhasil men-complete quest. Tetap immutable setelah quest dibuat.
-- 2. Tambah total_reward_pool (bigint NOT NULL). Total reward tersedia untuk quest.
--    Backfilled dari reward_per_user untuk row existing (anggap "pool = 1 user reward").
-- 3. Tambah total_reward_distributed (bigint NOT NULL DEFAULT 0). Running total reward
--    yang sudah diberikan ke participation success. Di-increment server saat
--    POST /agent/participations/:uuid/complete sukses (status → success).
--
-- quest_participations: TIDAK menambah kolom reward_amount. Sumber nilai reward untuk
-- claim direfer langsung ke quests.reward_per_user — aman karena field ini immutable.
--
-- Catatan: view leaderboard (migration 0007) tergantung ke quests.reward_amount, jadi
-- harus di-drop dulu sebelum rename/alter column, lalu di-recreate setelah.

drop view if exists public.leaderboard;

-- 1) Rename + retype reward_amount → reward_per_user (bigint)
alter table public.quests
  rename column reward_amount to reward_per_user;

alter table public.quests
  alter column reward_per_user type bigint using reward_per_user::bigint;

-- 2) Tambah total_reward_pool. Dua-step (nullable add → backfill → set not null) supaya
--    aman terhadap data existing.
alter table public.quests
  add column if not exists total_reward_pool bigint;

update public.quests
set    total_reward_pool = reward_per_user
where  total_reward_pool is null;

alter table public.quests
  alter column total_reward_pool set not null;

-- Constraints: pool ≥ 0 dan pool ≥ reward_per_user (tidak bisa janjikan reward per user
-- yang lebih besar dari pool).
alter table public.quests
  drop constraint if exists quests_total_reward_pool_nonneg;
alter table public.quests
  add constraint quests_total_reward_pool_nonneg check (total_reward_pool >= 0);

alter table public.quests
  drop constraint if exists quests_pool_gte_per_user;
alter table public.quests
  add constraint quests_pool_gte_per_user check (total_reward_pool >= reward_per_user);

-- 3) Tambah total_reward_distributed. Cap juga di check supaya tidak pernah lebih
--    besar dari pool.
alter table public.quests
  add column if not exists total_reward_distributed bigint not null default 0;

alter table public.quests
  drop constraint if exists quests_total_reward_distributed_nonneg;
alter table public.quests
  add constraint quests_total_reward_distributed_nonneg check (total_reward_distributed >= 0);

alter table public.quests
  drop constraint if exists quests_distributed_lte_pool;
alter table public.quests
  add constraint quests_distributed_lte_pool check (total_reward_distributed <= total_reward_pool);

-- 4) Recreate leaderboard view memakai q.reward_per_user (sumber langsung dari quest).
create or replace view public.leaderboard as
select
  u.uuid as user_uuid,
  u.wallet_address,
  coalesce(
    sum(
      case
        when qp.status = 'success' and qp.reward_claimed = true then q.reward_per_user
        else 0
      end
    ),
    0
  ) as total_reward,
  case
    when count(qp.id) = 0 then 0
    else sum(case when qp.status = 'success' then 1 else 0 end)::double precision / count(qp.id)::double precision
  end as success_rate
from public.users u
join public.quest_participations qp on qp.user_id = u.id
join public.quests q on q.id = qp.quest_id
group by u.uuid, u.wallet_address;
