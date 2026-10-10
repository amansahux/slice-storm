import { z } from "zod";
import { GameModeEnum, GameStatusEnum } from "./common.validator";

export const createGameSchema = z.object({
  body: z.object({
    sessionId: z.string({error:(issue)=>(issue.input === undefined ? "Session ID is required" : "Invalid session ID")}),
    mode: GameModeEnum,
    score: z.number().min(0, "Score must be non-negative"),
    fruitsSliced: z.number().min(0).optional(),
    fruitsMissed: z.number().min(0).optional(),
    bombsHit: z.number().min(0).optional(),
    maxCombo: z.number().min(0).optional(),
    accuracy: z.number().min(0).max(100).optional(),
    duration: z.number().min(0, "Duration is required"),
    level: z.number().min(1).optional(),
    status: GameStatusEnum.optional(),
  }),
});
