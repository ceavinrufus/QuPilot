-- Migration 0012 — block re-joining a quest after a successful participation
--
-- Background:
--   0004 already enforces "one inprogress per (user, quest)" via a partial
--   unique index. But a user who already finished a quest with status='success'
--   could still INSERT another inprogress row and execute / claim the reward
--   a second time.
--
-- This migration adds a second partial unique index for status='success',
-- so the combined effect is:
--   - At most one inprogress row per (user, quest)
--   - At most one success    row per (user, quest)
--   - failed rows remain unconstrained (user may retry after a failure)
--
-- Insert violations surface to PostgREST as SQLSTATE 23505; the service layer
-- maps that to a 409 with a domain-specific error code.

create unique index if not exists quest_participations_one_success_uidx
  on public.quest_participations (user_id, quest_id)
  where status = 'success';