import { z } from 'zod';

export const protocolSchema = z.enum(['byreal', 'bybit', 'sui']);
export type Protocol = z.infer<typeof protocolSchema>;

export const questTypeSchema = z.enum(['swap', 'lp', 'stake']);
export type QuestType = z.infer<typeof questTypeSchema>;

// bigint base units — stored as bigint in DB, accept string or integer in body.
const bigintAmount = z
  .coerce.bigint()
  .nonnegative()
  .transform((v) => v.toString());

export const createQuestBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(5000),
    protocol: protocolSchema,
    quest_type: questTypeSchema,
    // Array of step objects — DB constraint (0011) enforces jsonb_typeof = 'array'.
    action_params: z.array(z.record(z.string(), z.unknown())).min(1, 'action_params must contain at least one step'),
    total_reward_pool: bigintAmount,
    reward_per_user: bigintAmount,
    reward_token: z.string().trim().regex(/^0x[a-fA-F0-9]{40}$/, 'reward_token must be a 0x-prefixed ERC20 address'),
    tx_hash: z.string().trim().regex(/^0x[a-fA-F0-9]+$/, 'tx_hash must be hex (0x...)'),
    expires_at: z
      .string()
      .trim()
      .min(1)
      .refine((v) => !Number.isNaN(Date.parse(v)), 'expires_at must be a valid datetime string')
      .refine((v) => Date.parse(v) > Date.now(), 'expires_at must be in the future'),
  })
  .refine(
    (b) => BigInt(b.total_reward_pool) >= BigInt(b.reward_per_user),
    {
      message: 'total_reward_pool must be >= reward_per_user',
      path: ['total_reward_pool'],
    },
  );

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
