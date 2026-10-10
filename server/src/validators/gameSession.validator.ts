import { z } from "zod";

export const createGameSessionSchema = z.object({
  body: z.object({
    mode: z.enum(["classic", "arcade"], { required_error: "Mode is required" }),
  }),
});

export const updateGameSessionSchema = z.object({
  body: z.object({
    status: z.enum(["active", "completed", "expired", "abandoned"]),
  }),
});
