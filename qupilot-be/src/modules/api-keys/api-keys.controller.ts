import type { RequestHandler } from 'express';
import { AppError } from '../../lib/errors';
import * as service from './api-keys.service';
import type { GenerateBody } from './api-keys.schema';

export const generateMine: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth || req.auth.role !== 'user') {
      throw new AppError(403, 'FORBIDDEN', 'Requires user role');
    }
    const { plaintext, api_key } = await service.generateForUser(req.auth.sub, (req.body as GenerateBody).label);
    res.status(201).json({ plaintext, api_key });
  } catch (err) {
    next(err);
  }
};

export const getMine: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth || req.auth.role !== 'user') {
      throw new AppError(403, 'FORBIDDEN', 'Requires user role');
    }
    const api_key = await service.getActiveForUser(req.auth.sub);
    res.json({ api_key });
  } catch (err) {
    next(err);
  }
};

export const revokeMine: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth || req.auth.role !== 'user') {
      throw new AppError(403, 'FORBIDDEN', 'Requires user role');
    }
    const revoked = await service.revokeForUser(req.auth.sub);
    res.json({ revoked });
  } catch (err) {
    next(err);
  }
};
