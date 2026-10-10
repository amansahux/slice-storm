import { z } from "zod";

// ---------- Login Form Schema ----------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Player email is required")
    .email("Enter a valid email to continue slicing"),
  password: z
    .string()
    .min(6, "Blade password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ---------- Register Form Schema ----------
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Callsign must be at least 2 characters")
      .max(30, "Callsign cannot exceed 30 characters"),
    email: z
      .string()
      .min(1, "Player email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Blade password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match to forge your blade!",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
