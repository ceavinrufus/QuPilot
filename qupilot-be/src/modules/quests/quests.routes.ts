import { Router } from 'express';
import { authProvider } from '../../middlewares/auth-provider';
import { validate } from '../../middlewares/validate';
import { createQuestBodySchema, questUuidParamsSchema } from './quests.schema';
import * as controller from './quests.controller';

export const providerQuestsRouter = Router();

providerQuestsRouter.use(authProvider);

providerQuestsRouter.post('/', validate(createQuestBodySchema), controller.create);
providerQuestsRouter.get('/', controller.listByProvider);
providerQuestsRouter.get('/:uuid', validate(questUuidParamsSchema, 'params'), controller.getDetailForProvider);
providerQuestsRouter.patch('/:uuid', validate(questUuidParamsSchema, 'params'), controller.immutable);
providerQuestsRouter.put('/:uuid', validate(questUuidParamsSchema, 'params'), controller.immutable);
