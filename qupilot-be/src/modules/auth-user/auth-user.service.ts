import { supabase } from '../../config/supabase';
import { verifySolanaSignature } from '../../lib/wallet-signature';
import { signUserJwt } from '../../lib/jwt';
import { AppError } from '../../lib/errors';
import type { WalletLoginBody } from './auth-user.schema';

export type UserPublic = {
  uuid: string;
  wallet_address: string;
  created_at: string;
};

type UserRow = UserPublic & { id: number };

const USER_PUBLIC_COLS = 'uuid, wallet_address, created_at';

export const walletLogin = async (
  body: WalletLoginBody,
): Promise<{ token: string; user: UserPublic; created: boolean }> => {
  const ok = verifySolanaSignature(body.wallet_address, body.message, body.signature);
  if (!ok) {
    throw new AppError(401, 'INVALID_SIGNATURE', 'Wallet signature is invalid');
  }

  // Try existing first.
  const existing = await supabase
    .from('users')
    .select(`id, ${USER_PUBLIC_COLS}`)
    .eq('wallet_address', body.wallet_address)
    .maybeSingle();
  if (existing.error) throw existing.error;

  let row: UserRow;
  let created = false;

  if (existing.data) {
    row = existing.data as unknown as UserRow;
  } else {
    const inserted = await supabase
      .from('users')
      .insert({ wallet_address: body.wallet_address })
      .select(`id, ${USER_PUBLIC_COLS}`)
      .single();
    if (inserted.error) {
      // Race: another request inserted between SELECT and INSERT — re-fetch.
      if (inserted.error.code === '23505') {
        const refetch = await supabase
          .from('users')
          .select(`id, ${USER_PUBLIC_COLS}`)
          .eq('wallet_address', body.wallet_address)
          .single();
        if (refetch.error) throw refetch.error;
        row = refetch.data as unknown as UserRow;
      } else {
        throw inserted.error;
      }
    } else {
      row = inserted.data as unknown as UserRow;
      created = true;
    }
  }

  const token = signUserJwt({ sub: row.uuid, wallet_address: row.wallet_address });
  const { id: _id, ...user } = row;
  return { token, user, created };
};