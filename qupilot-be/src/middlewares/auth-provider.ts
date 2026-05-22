import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { verifyJwt } from '../lib/jwt';
import { AppError } from '../lib/errors';

export const authProvider: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Missing Bearer token'));
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyJwt(token);
    if (payload.role !== 'user_provider') {
      return next(new AppError(403, 'FORBIDDEN', 'Requires user_provider role'));
    }
    req.auth = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, 'INVALID_TOKEN', err.message));
    }
    next(err);
  }
};