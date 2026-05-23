import { z } from "zod";

export const loginProviderSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type ILoginProviderFormData = z.infer<typeof loginProviderSchema>;
