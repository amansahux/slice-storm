import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Dashboard summary requires user authentication
router.use(authMiddleware);

router.get("/summary", dashboardController.getSummary);

export default router;
