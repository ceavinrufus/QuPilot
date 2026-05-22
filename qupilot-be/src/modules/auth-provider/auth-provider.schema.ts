import { z } from 'zod';

export const registerBodySchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'username must be at least 3 chars')
    .max(64, 'username must be at most 64 chars')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'username may only contain letters, digits, _ . -'),
  password: z.string().min(8, 'password must be at least 8 chars').max(128),
  display_name: z.string().trim().min(1).max(120),
  logo_url: z.url().max(2048).optional(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

export const loginBodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
