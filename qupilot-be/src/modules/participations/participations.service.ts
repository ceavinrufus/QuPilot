import { supabase } from '../../config/supabase';
import { throw404 } from '../../lib/errors';

export type ParticipationStatus = 'inprogress' | 'success' | 'failed';

export type ParticipationItem = {
  uuid: string;
  status: ParticipationStatus;
  tx_hash: string | null;
  reward_claimed: boolean;
  started_at: string;
  completed_at: string | null;
  quest: {
    uuid: string;
    title: string;
    description: string;
    protocol: string;
    quest_type: string;
    reward_amount: number | string;
    reward_token: string;
    expires_at: string;
    created_at: string;
    provider: {
      uuid: string;
      display_name: string;
      logo_url: string | null;
    } | null;
  };
};

export type ParticipationDetail = ParticipationItem & { can_claim: boolean };

type UserRow = { id: number };

const resolveUserId = async (userUuid: string): Promise<number> => {
  const { data, error } = await supabase.from('users').select('id').eq('uuid', userUuid).maybeSingle();
  if (error) throw error;
  if (!data) throw404('USER_NOT_FOUND', 'User not found');
  return (data as UserRow).id;
};

const toProvider = (
  user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null,
) => (Array.isArray(user_providers) ? user_providers[0] ?? null : user_providers);

const toQuest = (
  quests:
    | {
        uuid: string;
        title: string;
        description: string;
        protocol: string;
        quest_type: string;
        reward_amount: number | string;
        reward_token: string;
        expires_at: string;
        created_at: string;
        user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
      }
    | {
        uuid: string;
        title: string;
        description: string;
        protocol: string;
        quest_type: string;
        reward_amount: number | string;
        reward_token: string;
        expires_at: string;
        created_at: string;
        user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
      }[]
    | null,
) => (Array.isArray(quests) ? quests[0] ?? null : quests);

export const listByUser = async (userUuid: string): Promise<ParticipationItem[]> => {
  const user_id = await resolveUserId(userUuid);

  const { data, error } = await supabase
    .from('quest_participations')
    .select(
      'uuid, status, tx_hash, reward_claimed, started_at, completed_at, quests(uuid, title, description, protocol, quest_type, reward_amount, reward_token, expires_at, created_at, user_providers(uuid, display_name, logo_url))',
    )
    .eq('user_id', user_id)
    .order('started_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as unknown as Array<{
    uuid: string;
    status: ParticipationStatus;
    tx_hash: string | null;
    reward_claimed: boolean;
    started_at: string;
    completed_at: string | null;
    quests:
      | {
      uuid: string;
      title: string;
      description: string;
      protocol: string;
      quest_type: string;
      reward_amount: number | string;
      reward_token: string;
      expires_at: string;
      created_at: string;
      user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
      }
      | {
          uuid: string;
          title: string;
          description: string;
          protocol: string;
          quest_type: string;
          reward_amount: number | string;
          reward_token: string;
          expires_at: string;
          created_at: string;
          user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
        }[]
      | null;
  }>;

  return rows
    .map((r) => ({ ...r, quests: toQuest(r.quests) }))
    .filter((r) => r.quests !== null)
    .map((r) => ({
      uuid: r.uuid,
      status: r.status,
      tx_hash: r.tx_hash,
      reward_claimed: r.reward_claimed,
      started_at: r.started_at,
      completed_at: r.completed_at,
      quest: {
        uuid: r.quests!.uuid,
        title: r.quests!.title,
        description: r.quests!.description,
        protocol: r.quests!.protocol,
        quest_type: r.quests!.quest_type,
        reward_amount: r.quests!.reward_amount,
        reward_token: r.quests!.reward_token,
        expires_at: r.quests!.expires_at,
        created_at: r.quests!.created_at,
        provider: toProvider(r.quests!.user_providers),
      },
    }));
};

export const getDetailForUser = async (userUuid: string, questUuid: string): Promise<ParticipationDetail> => {
  const user_id = await resolveUserId(userUuid);

  const { data, error } = await supabase
    .from('quest_participations')
    .select(
      'uuid, status, tx_hash, reward_claimed, started_at, completed_at, quests(uuid, title, description, protocol, quest_type, reward_amount, reward_token, expires_at, created_at, user_providers(uuid, display_name, logo_url))',
    )
    .eq('user_id', user_id)
    .eq('quests.uuid', questUuid)
    .order('started_at', { ascending: false })
    .maybeSingle();

  if (error) throw error;
  const base = data as unknown as { quests?: unknown };
  const maybeQuest = toQuest((base.quests ?? null) as any);
  if (!data || !maybeQuest) throw404('PARTICIPATION_NOT_FOUND', 'Participation not found');

  const row = data as unknown as {
    uuid: string;
    status: ParticipationStatus;
    tx_hash: string | null;
    reward_claimed: boolean;
    started_at: string;
    completed_at: string | null;
    quests:
      | {
      uuid: string;
      title: string;
      description: string;
      protocol: string;
      quest_type: string;
      reward_amount: number | string;
      reward_token: string;
      expires_at: string;
      created_at: string;
      user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
      }
      | {
          uuid: string;
          title: string;
          description: string;
          protocol: string;
          quest_type: string;
          reward_amount: number | string;
          reward_token: string;
          expires_at: string;
          created_at: string;
          user_providers: { uuid: string; display_name: string; logo_url: string | null } | { uuid: string; display_name: string; logo_url: string | null }[] | null;
        }[];
  };

  const q = toQuest(row.quests)!;

  const item: ParticipationItem = {
    uuid: row.uuid,
    status: row.status,
    tx_hash: row.tx_hash,
    reward_claimed: row.reward_claimed,
    started_at: row.started_at,
    completed_at: row.completed_at,
    quest: {
      uuid: q.uuid,
      title: q.title,
      description: q.description,
      protocol: q.protocol,
      quest_type: q.quest_type,
      reward_amount: q.reward_amount,
      reward_token: q.reward_token,
      expires_at: q.expires_at,
      created_at: q.created_at,
      provider: toProvider(q.user_providers),
    },
  };

  return {
    ...item,
    can_claim: item.status === 'success' && !item.reward_claimed,
  };
};
