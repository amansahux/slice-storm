import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import * as dashboardService from "../services/dashboard.service";

/**
 * Controller to fetch aggregated dashboard summary
 * Route: GET /api/dashboard/summary
 */
export const getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const summary = await dashboardService.getDashboardSummary(userId!);

  res.status(200).json({
    status: "success",
    data: summary,
  });
});
