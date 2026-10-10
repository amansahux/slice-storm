import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.registerUser(req.body);
  res.status(201).json({ status: "success", data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.loginUser(req.body);
  res.status(200).json({ status: "success", data: result });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.getUserProfile(req.user?.id);
  res.status(200).json({ status: "success", data: result });
});
