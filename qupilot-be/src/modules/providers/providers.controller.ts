import type { RequestHandler } from 'express';
import * as service from './providers.service';

export const listAll: RequestHandler = async (_req, res, next) => {
  try {
    const providers = await service.listAll();
    res.json({ providers });
  } catch (err) {
    next(err);
  }
};
