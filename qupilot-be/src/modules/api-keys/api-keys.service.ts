import { supabase } from '../../config/supabase';
import { AppError, throw404 } from '../../lib/errors';
import { extractPrefix, generatePlaintextKey, hashKey } from '../../lib/api-key';

export type ApiKeyMeta = {
  uuid: string;
  key_prefix: string;
  label: string | null;
  created_at: string;
  last_used_at: string | null;
};

type UserRow = { id: number };

const resolveUserId = async (userUuid: string): Promise<number> => {
  const { data, error } = await supabase.from('users').select('id').eq('uuid', userUuid).maybeSingle();
  if (error) throw error;
  if (!data) throw404('USER_NOT_FOUND', 'User not found');
  return (data as UserRow).id;
};

const nowIso = (): string => new Date().toISOString();

export const generateForUser = async (
  userUuid: string,
  label?: string,
): Promise<{ plaintext: string; api_key: Omit<ApiKeyMeta, 'last_used_at'> }> => {
  const user_id = await resolveUserId(userUuid);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const revoked = await supabase
      .from('agent_api_keys')
      .update({ revoked_at: nowIso() })
      .eq('user_id', user_id)
      .is('revoked_at', null);
    if (revoked.error) throw revoked.error;

    const plaintext = generatePlaintextKey();
    const key_prefix = extractPrefix(plaintext);
    const key_hash = hashKey(plaintext);

    const inserted = await supabase
      .from('agent_api_keys')
      .insert({
        user_id,
        key_prefix,
        key_hash,
        label: label ?? null,
      })
      .select('uuid, key_prefix, label, created_at')
      .single();

    if (!inserted.error) {
      return {
        plaintext,
        api_key: {
          uuid: inserted.data.uuid,
          key_prefix: inserted.data.key_prefix,
          label: inserted.data.label,
          created_at: inserted.data.created_at,
        },
      };
    }

    if (inserted.error.code !== '23505' || attempt === 1) {
      throw inserted.error;
    }
  }

  throw new AppError(500, 'API_KEY_GENERATION_FAILED', 'Failed to generate API key');
};

export const getActiveForUser = async (userUuid: string): Promise<ApiKeyMeta | null> => {
  const user_id = await resolveUserId(userUuid);

  const { data, error } = await supabase
    .from('agent_api_keys')
    .select('uuid, key_prefix, label, created_at, last_used_at')
    .eq('user_id', user_id)
    .is('revoked_at', null)
    .maybeSingle();

  if (error) throw error;
  return (data as ApiKeyMeta | null) ?? null;
};

export const revokeForUser = async (userUuid: string): Promise<boolean> => {
  const user_id = await resolveUserId(userUuid);

  const { data, error } = await supabase
    .from('agent_api_keys')
    .update({ revoked_at: nowIso() })
    .eq('user_id', user_id)
    .is('revoked_at', null)
    .select('uuid')
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
};
