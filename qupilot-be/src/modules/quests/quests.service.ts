import { supabase } from '../../config/supabase';
import { throw404 } from '../../lib/errors';
import type { CreateQuestBody, Protocol, QuestType } from './quests.schema';

export type QuestPublic = {
  uuid: string;
  title: string;
  description: string;
  protocol: Protocol;
  quest_type: QuestType;
  action_params: Record<string, unknown>;
  reward_amount: number;
  reward_token: string;
  expires_at: string;
  created_at: string;
};

export type QuestListItem = QuestPublic & { participation_count: number };

export type QuestAnalytics = {
  total: number;
  success: number;
  failed: number;
  success_rate: number;
};

type ProviderRow = { id: number };
type QuestRow = QuestPublic & { id: number };

const QUEST_PUBLIC_COLS =
  'uuid, title, description, protocol, quest_type, action_params, reward_amount, reward_token, expires_at, created_at';

const resolveProviderId = async (providerUuid: string): Promise<number> => {
  const { data, error } = await supabase.from('user_providers').select('id').eq('uuid', providerUuid).maybeSingle();
  if (error) throw error;
  if (!data) throw404('PROVIDER_NOT_FOUND', 'Provider not found');
  return (data as ProviderRow).id;
};

export const create = async (providerUuid: string, body: CreateQuestBody): Promise<QuestPublic> => {
  const provider_id = await resolveProviderId(providerUuid);

  const { data, error } = await supabase
    .from('quests')
    .insert({
      provider_id,
      title: body.title,
      description: body.description,
      protocol: body.protocol,
      quest_type: body.quest_type,
      action_params: body.action_params,
      reward_amount: body.reward_amount,
      reward_token: body.reward_token,
      expires_at: body.expires_at,
    })
    .select(QUEST_PUBLIC_COLS)
    .single();

  if (error) throw error;
  return data as unknown as QuestPublic;
};

export const listByProvider = async (providerUuid: string): Promise<QuestListItem[]> => {
  const provider_id = await resolveProviderId(providerUuid);

  const { data, error } = await supabase
    .from('quests')
    .select(`${QUEST_PUBLIC_COLS}, quest_participations(count)`)
    .eq('provider_id', provider_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Array<
    QuestPublic & {
      quest_participations?: Array<{ count: number }>;
    }
  >;

  return rows.map((row) => ({
    ...row,
    participation_count: row.quest_participations?.[0]?.count ?? 0,
  }));
};

const countParticipations = async (quest_id: number, status?: 'inprogress' | 'success' | 'failed'): Promise<number> => {
  let q = supabase.from('quest_participations').select('id', { count: 'exact', head: true }).eq('quest_id', quest_id);
  if (status) q = q.eq('status', status);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
};

export const getDetailForProvider = async (
  providerUuid: string,
  questUuid: string,
): Promise<{ quest: QuestPublic; analytics: QuestAnalytics }> => {
  const provider_id = await resolveProviderId(providerUuid);

  const { data, error } = await supabase
    .from('quests')
    .select(`id, ${QUEST_PUBLIC_COLS}`)
    .eq('provider_id', provider_id)
    .eq('uuid', questUuid)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw404('QUEST_NOT_FOUND', 'Quest not found');

  const row = data as unknown as QuestRow;

  const [total, success, failed] = await Promise.all([
    countParticipations(row.id),
    countParticipations(row.id, 'success'),
    countParticipations(row.id, 'failed'),
  ]);

  const analytics: QuestAnalytics = {
    total,
    success,
    failed,
    success_rate: total > 0 ? success / total : 0,
  };

  const { id: _id, ...quest } = row;
  return { quest, analytics };
};
