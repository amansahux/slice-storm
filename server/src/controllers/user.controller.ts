import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import { setAuthCookies, clearAuthCookies } from "../utils/cookieHelper";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.registerUser(req.body);
  res.status(201).json({ status: "success", data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.loginUser(req.body) as any;
  const { user, accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({ status: "success", data: { user, accessToken, refreshToken } });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  clearAuthCookies(res);
  res.status(200).json({ status: "success", message: "User logged out" });
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.slicestorm_refreshtoken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new AppError("Unauthorized request", 401);
  }

  const { accessToken, refreshToken } = await userService.refreshAccessTokenService(incomingRefreshToken);

  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({
    status: "success",
    data: { accessToken, refreshToken },
    message: "Access token refreshed",
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.getUserProfile(req.user?.id || req.user?._id);
  res.status(200).json({ status: "success", data: result });
});
