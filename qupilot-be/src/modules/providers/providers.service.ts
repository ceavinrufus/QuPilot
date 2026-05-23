import { supabase } from '../../config/supabase';

export type ProviderPublic = {
  uuid: string;
  display_name: string | null;
  logo_url: string | null;
  created_at: string;
  spotlight: boolean;
};

const PROVIDER_PUBLIC_COLS = 'uuid, display_name, logo_url, created_at';

export const listAll = async (): Promise<ProviderPublic[]> => {
  const { data, error } = await supabase
    .from('users')
    .select(PROVIDER_PUBLIC_COLS)
    .eq('role', 'user_provider')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Omit<ProviderPublic, 'spotlight'>[];
  return rows.map((row) => ({ ...row, spotlight: false }));
};
