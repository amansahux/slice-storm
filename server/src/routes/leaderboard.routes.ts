import { Router } from "express";
import * as leaderboardController from "../controllers/leaderboard.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { getModeLeaderboardSchema } from "../validators/leaderboard.validator";

const router = Router();

router.get("/global", leaderboardController.getGlobal);
router.get("/:mode", validateRequest(getModeLeaderboardSchema), leaderboardController.getByMode);

export default router;
