import type { RequestHandler } from 'express';
import * as service from './leaderboard.service';

export const getTop: RequestHandler = async (req, res, next) => {
  try {
    const limitRaw = (req.query as { limit?: string }).limit;
    const limit = limitRaw ? Number(limitRaw) : 100;
    const entries = await service.getTop(Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 100);
    res.json({ entries });
  } catch (err) {
    next(err);
  }
};
