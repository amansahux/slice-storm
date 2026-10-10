import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as settingService from "../services/setting.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const get = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await settingService.getSettings(req.user?.id);
  res.status(200).json({ status: "success", data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await settingService.updateSettings(req.user?.id, req.body);
  res.status(200).json({ status: "success", data: result });
});
