import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email must be 254 characters or fewer.")
    .pipe(z.email("Enter a valid email address."))
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must be 128 characters or fewer."),
});

export type LoginInput = z.infer<typeof loginSchema>;
