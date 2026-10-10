import { z } from "zod";
import { GameModeEnum, GameSessionStatusEnum } from "./common.validator";

export const createGameSessionSchema = z.object({
  body: z.object({
    mode: GameModeEnum,
  }),
});

export const updateGameSessionSchema = z.object({
  body: z.object({
    status: GameSessionStatusEnum,
  }),
});
