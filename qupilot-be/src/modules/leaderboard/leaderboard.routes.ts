import { Router } from 'express';
import * as controller from './leaderboard.controller';

export const leaderboardRouter = Router();

leaderboardRouter.get('/leaderboard', controller.getTop);
