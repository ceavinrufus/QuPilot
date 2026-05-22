import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { walletLoginBodySchema } from './auth-user.schema';
import * as controller from './auth-user.controller';

export const authUserRouter = Router();

authUserRouter.post('/login', validate(walletLoginBodySchema), controller.walletLogin);