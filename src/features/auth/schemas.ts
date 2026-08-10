import { z } from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be less than 32 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type SignInFormData = z.infer<typeof SignInSchema>;
