import { supabase } from '../../config/supabase';
import { hashPassword, verifyPassword } from '../../lib/password';
import { signProviderJwt } from '../../lib/jwt';
import { AppError } from '../../lib/errors';
import type { RegisterBody, LoginBody } from './auth-provider.schema';

export type ProviderPublic = {
  uuid: string;
  username: string;
  display_name: string;
  logo_url: string | null;
  created_at: string;
};

type ProviderRow = ProviderPublic & {
  id: number;
  password_hash: string;
};

const PROVIDER_PUBLIC_COLS = 'uuid, username, display_name, logo_url, created_at';

export const register = async (body: RegisterBody): Promise<ProviderPublic> => {
  const password_hash = await hashPassword(body.password);

  const { data, error } = await supabase
    .from('user_providers')
    .insert({
      username: body.username,
      password_hash,
      display_name: body.display_name,
      logo_url: body.logo_url ?? null,
    })
    .select(PROVIDER_PUBLIC_COLS)
    .single();

  if (error) {
    // 23505 = unique_violation (username already taken)
    if (error.code === '23505') {
      throw new AppError(409, 'USERNAME_TAKEN', 'Username already taken');
    }
    throw error;
  }

  return data as ProviderPublic;
};

export const login = async (body: LoginBody): Promise<{ token: string; provider: ProviderPublic }> => {
  const { data, error } = await supabase
    .from('user_providers')
    .select(`id, password_hash, ${PROVIDER_PUBLIC_COLS}`)
    .eq('username', body.username)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
  }

  const row = data as unknown as ProviderRow;
  const ok = await verifyPassword(body.password, row.password_hash);
  if (!ok) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
  }

  const token = signProviderJwt({ sub: row.uuid, username: row.username });

  const { id: _id, password_hash: _ph, ...provider } = row;
  return { token, provider };
};
