import { z } from 'zod';

export const protocolSchema = z.enum(['byreal', 'bybit', 'sui']);
export type Protocol = z.infer<typeof protocolSchema>;

export const questTypeSchema = z.enum(['swap', 'lp', 'stake']);
export type QuestType = z.infer<typeof questTypeSchema>;

export const createQuestBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  protocol: protocolSchema,
  quest_type: questTypeSchema,
  action_params: z.record(z.string(), z.unknown()),
  reward_amount: z.coerce.number().finite().min(0),
  reward_token: z.string().trim().min(1).max(64),
  expires_at: z
    .string()
    .trim()
    .min(1)
    .refine((v) => !Number.isNaN(Date.parse(v)), 'expires_at must be a valid datetime string')
    .refine((v) => Date.parse(v) > Date.now(), 'expires_at must be in the future'),
});

export type CreateQuestBody = z.infer<typeof createQuestBodySchema>;

export const questUuidParamsSchema = z.object({
  uuid: z.string().uuid(),
});

export type QuestUuidParams = z.infer<typeof questUuidParamsSchema>;

export const listPublicQuerySchema = z.object({
  protocol: protocolSchema.optional(),
  type: questTypeSchema.optional(),
});

export type ListPublicQuery = z.infer<typeof listPublicQuerySchema>;
