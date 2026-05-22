import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../lib/errors';

export const authAgent: RequestHandler = (req, _res, next) => {
  const provided = req.headers['x-api-key'];
  if (typeof provided !== 'string' || provided.length === 0) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Missing x-api-key header'));
  }
  if (provided !== env.AI_AGENT_API_KEY) {
    return next(new AppError(401, 'INVALID_API_KEY', 'Invalid API key'));
  }
  req.auth = { role: 'agent' };
  next();
};