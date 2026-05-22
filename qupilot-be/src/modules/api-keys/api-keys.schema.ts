import { z } from 'zod';

export const generateBodySchema = z.object({
  label: z.string().trim().min(1).max(120).optional(),
});

export type GenerateBody = z.infer<typeof generateBodySchema>;
