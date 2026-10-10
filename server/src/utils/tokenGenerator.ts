import jwt from "jsonwebtoken";
import { AppError } from "./AppError";
import User from "../models/user.model";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/config";

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export const generateAccessToken = (user: { _id: any; email: string; name: string }) => {
  return jwt.sign(
    { _id: user._id, email: user.email, name: user.name },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { _id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] }
  );
};

export const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};