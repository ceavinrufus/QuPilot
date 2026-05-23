import { z } from "zod";

export const registerProviderSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters"),
    logoUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type IRegisterProviderFormData = z.infer<typeof registerProviderSchema>;
