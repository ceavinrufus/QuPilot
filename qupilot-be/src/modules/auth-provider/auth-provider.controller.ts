import type { RequestHandler } from 'express';
import * as service from './auth-provider.service';
import type { RegisterBody, LoginBody } from './auth-provider.schema';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const provider = await service.register(req.body as RegisterBody);
    res.status(201).json({ provider });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { token, provider } = await service.login(req.body as LoginBody);
    res.json({ token, provider });
  } catch (err) {
    next(err);
  }
};
