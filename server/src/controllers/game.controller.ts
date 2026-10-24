import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as gameService from "../services/game.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await gameService.createGame({ ...req.body, userId: req.user?.id });
  res.status(201).json({ status: "success", data: result });
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const result = await gameService.getGameHistory(req.user?.id, limit, page);
  res.status(200).json({ status: "success", data: result });
});
