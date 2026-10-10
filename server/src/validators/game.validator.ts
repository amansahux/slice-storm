import { z } from "zod";

export const createGameSchema = z.object({
  body: z.object({
    sessionId: z.string({ required_error: "Session ID is required" }),
    mode: z.enum(["classic", "arcade"], { required_error: "Mode is required" }),
    score: z.number().min(0, "Score must be non-negative"),
    fruitsSliced: z.number().min(0).optional(),
    fruitsMissed: z.number().min(0).optional(),
    bombsHit: z.number().min(0).optional(),
    maxCombo: z.number().min(0).optional(),
    accuracy: z.number().min(0).max(100).optional(),
    duration: z.number().min(0, "Duration is required"),
    level: z.number().min(1).optional(),
    status: z.enum(["completed", "invalid"]).optional(),
  }),
});
