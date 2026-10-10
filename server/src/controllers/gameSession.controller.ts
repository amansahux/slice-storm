import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as gameSessionService from "../services/gameSession.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await gameSessionService.createSession({ ...req.body, userId: req.user?.id });
  res.status(201).json({ status: "success", data: result });
});

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await gameSessionService.updateSessionStatus(req.params.id, req.body.status);
  res.status(200).json({ status: "success", data: result });
});
