import { supabase } from '../../config/supabase';
import { AppError, throw404 } from '../../lib/errors';
import { verifyTxBasic } from '../../lib/solana';
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
    if (inserted.error.code === '23505') {
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
  status: 'inprogress' | 'success' | 'failed';
};

export const complete = async (
  userId: number,
  participationUuid: string,
  txHash: string,
): Promise<{ uuid: string; status: 'success' | 'failed'; completed_at: string }> => {
  const { data, error } = await supabase
    .from('quest_participations')
    .select('id, uuid, user_id, status')
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

  const updated = await supabase
    .from('quest_participations')
    .update({ status, completed_at, tx_hash: txHash })
    .eq('id', row.id)
    .select('uuid, status, completed_at')
    .single();

  if (updated.error) throw updated.error;
  return updated.data as { uuid: string; status: 'success' | 'failed'; completed_at: string };
};

export const claim = async (userId: number): Promise<ClaimResult> => {
  const wallet = await resolveUserWalletById(userId);
  return claimAllByUserId(userId, wallet);
};
