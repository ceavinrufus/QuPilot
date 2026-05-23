import { supabase } from '../../config/supabase';
import { throw404 } from '../../lib/errors';
import type { CreateQuestBody, ListPublicQuery, Protocol, QuestType } from './quests.schema';

export type QuestPublic = {
  uuid: string;
  title: string;
  description: string;
  protocol: Protocol;
  quest_type: QuestType;
  action_params: Record<string, unknown>;
  total_reward_pool: number | string;
  reward_per_user: number | string;
  total_reward_distributed: number | string;
  reward_token: string;
  expires_at: string;
  created_at: string;
};

export type QuestListItem = QuestPublic & { participation_count: number };

export type ProviderSummary = {
  uuid: string;
  display_name: string | null;
  logo_url: string | null;
};

export type PublicQuestListItem = QuestListItem & { provider: ProviderSummary | null };

export type QuestAnalytics = {
  total: number;
  success: number;
  failed: number;
  success_rate: number;
};

type ProviderRow = { id: number };
type QuestRow = QuestPublic & { id: number };

const QUEST_PUBLIC_COLS =
  'uuid, title, description, protocol, quest_type, action_params, total_reward_pool, reward_per_user, total_reward_distributed, reward_token, expires_at, created_at';

const resolveProviderId = async (providerUuid: string): Promise<number> => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('uuid', providerUuid)
    .eq('role', 'user_provider')
    .maybeSingle();
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
      total_reward_pool: body.total_reward_pool,
      reward_per_user: body.reward_per_user,
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

const nowIso = (): string => new Date().toISOString();

export const listPublic = async (query: ListPublicQuery): Promise<PublicQuestListItem[]> => {
  let q = supabase
    .from('quests')
    .select(
      `${QUEST_PUBLIC_COLS}, users(uuid, display_name, logo_url), quest_participations(count)`,
    )
    .gt('expires_at', nowIso())
    .order('created_at', { ascending: false });

  if (query.protocol) q = q.eq('protocol', query.protocol);
  if (query.type) q = q.eq('quest_type', query.type);

  const { data, error } = await q;
  if (error) throw error;

  const rows = (data ?? []) as Array<
    QuestPublic & {
      users: ProviderSummary | ProviderSummary[] | null;
      quest_participations?: Array<{ count: number }>;
    }
  >;

  return rows.map((row) => ({
    ...row,
    provider: Array.isArray(row.users) ? row.users[0] ?? null : row.users,
    participation_count: row.quest_participations?.[0]?.count ?? 0,
  }));
};

export const listPublicByProvider = async (providerUuid: string): Promise<PublicQuestListItem[]> => {
  const provider_id = await resolveProviderId(providerUuid);

  const { data, error } = await supabase
    .from('quests')
    .select(
      `${QUEST_PUBLIC_COLS}, users(uuid, display_name, logo_url), quest_participations(count)`,
    )
    .eq('provider_id', provider_id)
    .gt('expires_at', nowIso())
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Array<
    QuestPublic & {
      users: ProviderSummary | ProviderSummary[] | null;
      quest_participations?: Array<{ count: number }>;
    }
  >;

  return rows.map((row) => ({
    ...row,
    provider: Array.isArray(row.users) ? row.users[0] ?? null : row.users,
    participation_count: row.quest_participations?.[0]?.count ?? 0,
  }));
};

export const getPublicDetail = async (questUuid: string): Promise<{ quest: PublicQuestListItem }> => {
  const { data, error } = await supabase
    .from('quests')
    .select(
      `${QUEST_PUBLIC_COLS}, users(uuid, display_name, logo_url), quest_participations(count)`,
    )
    .eq('uuid', questUuid)
    .gt('expires_at', nowIso())
    .maybeSingle();

  if (error) throw error;
  if (!data) throw404('QUEST_NOT_FOUND', 'Quest not found');

  const row = data as unknown as QuestPublic & {
    users: ProviderSummary | ProviderSummary[] | null;
    quest_participations?: Array<{ count: number }>;
  };

  const quest: PublicQuestListItem = {
    ...row,
    provider: Array.isArray(row.users) ? row.users[0] ?? null : row.users,
    participation_count: row.quest_participations?.[0]?.count ?? 0,
  };

  return { quest };
};
