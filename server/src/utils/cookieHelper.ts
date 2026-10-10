import { Response } from "express";
import { NODE_ENV } from "../config/config";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res
    .cookie("slicestorm_accesstoken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
    .cookie("slicestorm_refreshtoken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });
};

export const clearAuthCookies = (res: Response) => {
  res
    .clearCookie("slicestorm_accesstoken", cookieOptions)
    .clearCookie("slicestorm_refreshtoken", cookieOptions);
};
