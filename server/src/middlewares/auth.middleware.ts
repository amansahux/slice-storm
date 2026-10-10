import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any; // TODO: Replace with proper user type
  accessToken?: string;
  refreshToken?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Read/extract slicestorm_accesstoken and slicestorm_refreshtoken from cookies
  const accessToken = req.cookies?.slicestorm_accesstoken;
  const refreshToken = req.cookies?.slicestorm_refreshtoken;

  req.accessToken = accessToken;
  req.refreshToken = refreshToken;

  // TODO: Implement authentication, JWT verification, token refresh, user lookup, or authorization
  next();
};
