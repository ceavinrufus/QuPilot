import { Router } from 'express';
import * as controller from './providers.controller';

export const providersRouter = Router();

providersRouter.get('/', controller.listAll);
