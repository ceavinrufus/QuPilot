import { z } from 'zod';

export const walletLoginBodySchema = z.object({
  wallet_address: z
    .string()
    .trim()
    .min(32, 'wallet_address must be a base58 Solana public key')
    .max(44),
  signature: z.string().trim().min(1, 'signature is required (base58)'),
  message: z.string().min(1, 'message is required').max(2048),
});

export type WalletLoginBody = z.infer<typeof walletLoginBodySchema>;