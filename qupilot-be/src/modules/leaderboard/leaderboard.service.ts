import { supabase } from '../../config/supabase';

export type LeaderboardEntry = {
  user_uuid: string;
  wallet_address: string;
  // bigint sum returned as string from PostgREST
  total_reward: number | string;
  success_rate: number;
};

export const getTop = async (limit = 100): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('user_uuid, wallet_address, total_reward, success_rate')
    .order('total_reward', { ascending: false })
    .order('success_rate', { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 100));
  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
};
