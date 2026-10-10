import { z } from "zod";
import { GameModeEnum } from "./common.validator";

export const getModeLeaderboardSchema = z.object({
  params: z.object({
    mode: GameModeEnum,
  }),
});
