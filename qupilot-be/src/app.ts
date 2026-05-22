import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/error-handler';
import { authProviderRouter } from './modules/auth-provider/auth-provider.routes';
import { authUserRouter } from './modules/auth-user/auth-user.routes';
import { providersRouter } from './modules/providers/providers.routes';
import { providerQuestsRouter } from './modules/quests/quests.routes';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/auth/provider', authProviderRouter);
  app.use('/auth/user', authUserRouter);
  app.use('/providers', providersRouter);
  app.use('/provider/quests', providerQuestsRouter);

  app.use(errorHandler);

  return app;
};
