import { z } from 'zod';

export const walletLoginBodySchema = z.object({
  wallet_address: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'wallet_address must be a 0x-prefixed EVM address'),
  signature: z.string().trim().regex(/^0x[a-fA-F0-9]+$/, 'signature must be hex (0x...)'),
  message: z.string().min(1, 'message is required').max(2048),
  role: z.enum(['user', 'user_provider']).optional(),
  display_name: z.string().trim().min(1).max(100).optional(),
  logo_url: z.string().trim().url().max(2048).optional(),
});

export type WalletLoginBody = z.infer<typeof walletLoginBodySchema>;
