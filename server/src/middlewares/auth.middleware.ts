import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { JWT_ACCESS_SECRET } from "../config/config";

export interface AuthRequest extends Request {
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}

export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.slicestorm_accesstoken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new AppError("Unauthorized request", 401);
  }

  try {
    const decodedToken = jwt.verify(token, JWT_ACCESS_SECRET as string) as any;

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new AppError("Invalid Access Token", 401);
    }

    req.user = user;
    req.accessToken = token;
    req.refreshToken = req.cookies?.slicestorm_refreshtoken;

    next();
  } catch (error) {
    throw new AppError("Invalid Access Token", 401);
  }
});
