import { z } from "zod";

export const GameModeEnum = z.enum(["classic", "blitz", "arcade", "zen"]);

export const GameStatusEnum = z.enum(["completed", "invalid"]);

export const GameSessionStatusEnum = z.enum(["active", "completed", "expired", "abandoned"]);

export type GameMode = z.infer<typeof GameModeEnum>;
export type GameStatus = z.infer<typeof GameStatusEnum>;
export type GameSessionStatus = z.infer<typeof GameSessionStatusEnum>;
