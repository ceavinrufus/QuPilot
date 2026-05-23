-- Migration 0011 — quests.action_params: object → array of objects
--
-- Before: action_params jsonb (single object, mis. {"input": "USDC", ...})
-- After : action_params jsonb (JSON array of objects, mis. [{"input": "USDC"}, {...}])
--
-- Setiap row di-wrap ke array satu elemen supaya data lama tetap valid.
-- Row yang sudah berbentuk array dibiarkan apa adanya (idempotent).
-- Check constraint memastikan nilai baru selalu `jsonb_typeof = 'array'`.

-- 1) Backfill: bungkus object jadi array satu elemen. NULL & array yang sudah ada di-skip.
update public.quests
set    action_params = jsonb_build_array(action_params)
where  action_params is not null
  and  jsonb_typeof(action_params) <> 'array';

-- 2) Enforce ke depan: action_params wajib jsonb array.
alter table public.quests
  drop constraint if exists quests_action_params_is_array;

alter table public.quests
  add constraint quests_action_params_is_array
  check (action_params is null or jsonb_typeof(action_params) = 'array');
