import type { RequestHandler } from 'express';
import { supabase } from '../config/supabase';
import { extractPrefix, verifyKey } from '../lib/api-key';
import { AppError } from '../lib/errors';

export const authAgent: RequestHandler = async (req, _res, next) => {
  try {
    const provided = req.headers['x-api-key'];
    if (typeof provided !== 'string' || provided.length === 0) {
      next(new AppError(401, 'UNAUTHENTICATED', 'Missing x-api-key header'));
      return;
    }
    if (!provided.startsWith('qpk_') || provided.length < 12) {
      next(new AppError(401, 'INVALID_API_KEY', 'Invalid API key'));
      return;
    }

    const prefix = extractPrefix(provided);

    const { data, error } = await supabase
      .from('agent_api_keys')
      .select('id, user_id, key_hash')
      .eq('key_prefix', prefix)
      .is('revoked_at', null)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      next(new AppError(401, 'INVALID_API_KEY', 'Invalid API key'));
      return;
    }

    const ok = verifyKey(provided, data.key_hash);
    if (!ok) {
      next(new AppError(401, 'INVALID_API_KEY', 'Invalid API key'));
      return;
    }

    req.auth = { role: 'agent', user_id: data.user_id as number, key_id: data.id as number };

    void supabase
      .from('agent_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(
        () => undefined,
        () => undefined,
      );

    next();
  } catch (err) {
    next(err);
  }
};
