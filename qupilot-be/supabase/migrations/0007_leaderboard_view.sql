-- Migration 0007 — leaderboard view (no materialized view)

create or replace view public.leaderboard as
select
  u.uuid as user_uuid,
  u.wallet_address,
  coalesce(
    sum(
      case
        when qp.status = 'success' and qp.reward_claimed = true then q.reward_amount
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
