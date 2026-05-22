import type { RequestHandler } from 'express';
import * as service from './auth-user.service';
import type { WalletLoginBody } from './auth-user.schema';

export const walletLogin: RequestHandler = async (req, res, next) => {
  try {
    const result = await service.walletLogin(req.body as WalletLoginBody);
    res.status(result.created ? 201 : 200).json({
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};