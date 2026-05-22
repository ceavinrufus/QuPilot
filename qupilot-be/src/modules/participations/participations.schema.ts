import { z } from 'zod';

export const participationQuestUuidParamsSchema = z.object({
  questUuid: z.string().uuid(),
});

export type ParticipationQuestUuidParams = z.infer<typeof participationQuestUuidParamsSchema>;
