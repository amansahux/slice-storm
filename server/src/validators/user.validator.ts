import { z } from "zod";

const nameSchema = z.string({
    error: (issue) =>
        issue.input === undefined
            ? "Name is required"
            : "Name must be a string"
}).min(2, { error: "Name is too short" });
const emailSchema = z.email({
    error: (issue) =>
        issue.input === undefined ? "Email is required" : "Invalid email"
});
const passwordSchema = z.string({
    error: (issue) =>
        issue.input === undefined
            ? "Password is required"
            : issue.input === "too_small"
                ? "Password must be at least 6 characters"
                : "Invalid password"
}).min(6, { error: "Password must be at least 6 characters" });
const passwordLoginSchema = z.string({
    error: (issue) =>
        issue.input === undefined
            ? "Password is required"
            : "Password must be a string"
});

export const registerUserSchema = z.object({
    body: z.object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
    }),
});

export const loginUserSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordLoginSchema,
    }),
});

export const updateSettingsSchema = z.object({
    body: z.object({
        soundEnabled: z.boolean().optional(),
        musicEnabled: z.boolean().optional(),
    }),
});
