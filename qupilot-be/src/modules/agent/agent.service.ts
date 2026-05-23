import { supabase } from '../../config/supabase';
import { AppError, throw404 } from '../../lib/errors';
import { verifyTxBasic } from '../../lib/evm';
import {
  claimAllByUserId,
  resolveUserWalletById,
  type ClaimResult,
} from '../participations/participations.service';

type QuestRow = { id: number; expires_at: string };

const nowIso = (): string => new Date().toISOString();

const resolveQuestId = async (questUuid: string): Promise<QuestRow> => {
  const { data, error } = await supabase.from('quests').select('id, expires_at').eq('uuid', questUuid).maybeSingle();
  if (error) throw error;
  if (!data) throw404('QUEST_NOT_FOUND', 'Quest not found');
  return data as QuestRow;
};

export const join = async (
  userId: number,
  questUuid: string,
): Promise<{ uuid: string; status: 'inprogress'; started_at: string }> => {
  const quest = await resolveQuestId(questUuid);
  if (Date.parse(quest.expires_at) <= Date.now()) {
    throw new AppError(400, 'QUEST_EXPIRED', 'Quest has expired');
  }

  // Pre-check to return a precise error code.
  // Race-condition safety is provided by the partial unique indexes in DB
  // (see migrations 0004 + 0012), which raise SQLSTATE 23505 on conflict.
  const existing = await supabase
    .from('quest_participations')
    .select('status')
    .eq('user_id', userId)
    .eq('quest_id', quest.id)
    .in('status', ['inprogress', 'success']);

  if (existing.error) throw existing.error;
  if (existing.data && existing.data.length > 0) {
    const statuses = new Set(existing.data.map((r) => (r as { status: string }).status));
    if (statuses.has('success')) {
      throw new AppError(409, 'PARTICIPATION_ALREADY_COMPLETED', 'Quest already completed by this user');
    }
    throw new AppError(409, 'PARTICIPATION_INPROGRESS_EXISTS', 'Participation already in progress for this quest');
  }

  const inserted = await supabase
    .from('quest_participations')
    .insert({
      user_id: userId,
      quest_id: quest.id,
      status: 'inprogress',
    })
    .select('uuid, status, started_at')
    .single();

  if (inserted.error) {
    // Fallback: a concurrent insert won the race between pre-check and insert.
    // We can't tell inprogress vs success from the error alone, so re-query.
    if (inserted.error.code === '23505') {
      const recheck = await supabase
        .from('quest_participations')
        .select('status')
        .eq('user_id', userId)
        .eq('quest_id', quest.id)
        .in('status', ['inprogress', 'success']);
      const hasSuccess = (recheck.data ?? []).some(
        (r) => (r as { status: string }).status === 'success',
      );
      if (hasSuccess) {
        throw new AppError(409, 'PARTICIPATION_ALREADY_COMPLETED', 'Quest already completed by this user');
      }
      throw new AppError(409, 'PARTICIPATION_INPROGRESS_EXISTS', 'Participation already in progress for this quest');
    }
    throw inserted.error;
  }

  return inserted.data as { uuid: string; status: 'inprogress'; started_at: string };
};

type ParticipationRow = {
  id: number;
  uuid: string;
  user_id: number;
  quest_id: number;
  status: 'inprogress' | 'success' | 'failed';
};

type QuestRewardRow = {
  id: number;
  reward_per_user: number | string;
  total_reward_pool: number | string;
  total_reward_distributed: number | string;
};

const toBigIntSafe = (v: number | string): bigint => {
  if (typeof v === 'number') return BigInt(Math.trunc(v));
  return BigInt(v);
};

export const complete = async (
  userId: number,
  participationUuid: string,
  txHash: string,
): Promise<{
  uuid: string;
  status: 'success' | 'failed';
  completed_at: string;
}> => {
  const { data, error } = await supabase
    .from('quest_participations')
    .select('id, uuid, user_id, quest_id, status')
    .eq('uuid', participationUuid)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw404('PARTICIPATION_NOT_FOUND', 'Participation not found');

  const row = data as unknown as ParticipationRow;
  if (row.user_id !== userId) {
    throw new AppError(403, 'FORBIDDEN', 'Participation does not belong to this user');
  }
  if (row.status !== 'inprogress') {
    throw new AppError(409, 'PARTICIPATION_NOT_INPROGRESS', 'Participation is not in progress');
  }

  const userWallet = await resolveUserWalletById(userId);
  const ok = await verifyTxBasic(txHash, userWallet);
  const status: 'success' | 'failed' = ok ? 'success' : 'failed';
  const completed_at = nowIso();

  // Saat sukses, bump quests.total_reward_distributed sebesar reward_per_user.
  // Tolak kalau pool sudah habis (total_reward_distributed + reward_per_user > pool)
  // supaya tidak melewati janji provider.
  if (status === 'success') {
    const questRes = await supabase
      .from('quests')
      .select('id, reward_per_user, total_reward_pool, total_reward_distributed')
      .eq('id', row.quest_id)
      .maybeSingle();
    if (questRes.error) throw questRes.error;
    if (!questRes.data) throw404('QUEST_NOT_FOUND', 'Quest not found');

    const quest = questRes.data as unknown as QuestRewardRow;
    const perUser = toBigIntSafe(quest.reward_per_user);
    const pool = toBigIntSafe(quest.total_reward_pool);
    const distributed = toBigIntSafe(quest.total_reward_distributed);
    const newDistributed = distributed + perUser;

    if (newDistributed > pool) {
      throw new AppError(409, 'REWARD_POOL_EXHAUSTED', 'Quest reward pool has been exhausted');
    }

    const bumpRes = await supabase
      .from('quests')
      .update({ total_reward_distributed: newDistributed.toString() })
      .eq('id', quest.id);
    if (bumpRes.error) throw bumpRes.error;
  }

  const updated = await supabase
    .from('quest_participations')
    .update({
      status,
      completed_at,
      tx_hash: txHash,
    })
    .eq('id', row.id)
    .select('uuid, status, completed_at')
    .single();

  if (updated.error) throw updated.error;
  return updated.data as {
    uuid: string;
    status: 'success' | 'failed';
    completed_at: string;
  };
};

export const claim = async (userId: number): Promise<ClaimResult> => {
  const wallet = await resolveUserWalletById(userId);
  return claimAllByUserId(userId, wallet);
};
