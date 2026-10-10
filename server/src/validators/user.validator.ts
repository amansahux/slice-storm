import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2, "Name is too short"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    soundEnabled: z.boolean().optional(),
    musicEnabled: z.boolean().optional(),
  }),
});
