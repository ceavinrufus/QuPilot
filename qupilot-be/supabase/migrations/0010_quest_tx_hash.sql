-- Migration 0010 — quests.tx_hash
--
-- Store provider's on-chain tx hash related to quest creation/funding.

alter table public.quests
  add column if not exists tx_hash text;

update public.quests
set    tx_hash = '0x0'
where  tx_hash is null;

alter table public.quests
  alter column tx_hash set not null;

alter table public.quests
  drop constraint if exists quests_tx_hash_nonempty;
alter table public.quests
  add constraint quests_tx_hash_nonempty check (length(tx_hash) > 0);
