import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { registerBodySchema, loginBodySchema } from './auth-provider.schema';
import * as controller from './auth-provider.controller';

export const authProviderRouter = Router();

authProviderRouter.post('/register', validate(registerBodySchema), controller.register);
authProviderRouter.post('/login', validate(loginBodySchema), controller.login);
