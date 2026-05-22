import { z } from 'zod';

export const joinBodySchema = z.object({
  quest_uuid: z.string().uuid(),
});

export type JoinBody = z.infer<typeof joinBodySchema>;

export const completeBodySchema = z.object({
  tx_hash: z.string().trim().min(20).max(200),
});

export type CompleteBody = z.infer<typeof completeBodySchema>;

export const participationUuidParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export type ParticipationUuidParams = z.infer<typeof participationUuidParamsSchema>;
