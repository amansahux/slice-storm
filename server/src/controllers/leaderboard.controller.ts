import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as leaderboardService from "../services/leaderboard.service";
import { GameMode } from "../validators/common.validator";

export const getGlobal = asyncHandler(async (_req: Request, res: Response) => {
  const result = await leaderboardService.getGlobalLeaderboard();
  res.status(200).json({ status: "success", data: result });
});

export const getByMode = asyncHandler(async (req: Request, res: Response) => {
  const mode = req.params.mode as GameMode;
  const result = await leaderboardService.getModeLeaderboard(mode);
  res.status(200).json({ status: "success", data: result });
});
