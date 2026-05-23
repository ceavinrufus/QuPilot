import type { RequestHandler } from 'express';
import * as service from './auth-user.service';
import type { WalletLoginBody } from './auth-user.schema';

export const walletLogin: RequestHandler = async (req, res, next) => {
  try {
    const result = await service.walletLogin(req.body as WalletLoginBody);
    if (!result.registered) {
      res.status(200).json({ registered: false });
      return;
    }
    res.status(result.created ? 201 : 200).json({
      registered: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};
