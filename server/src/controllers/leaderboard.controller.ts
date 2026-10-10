import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as leaderboardService from "../services/leaderboard.service";

export const getGlobal = asyncHandler(async (req: Request, res: Response) => {
  const result = await leaderboardService.getGlobalLeaderboard();
  res.status(200).json({ status: "success", data: result });
});

export const getByMode = asyncHandler(async (req: Request, res: Response) => {
  const result = await leaderboardService.getModeLeaderboard(req.params.mode);
  res.status(200).json({ status: "success", data: result });
});
