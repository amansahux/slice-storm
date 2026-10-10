import { Router } from "express";
import * as leaderboardController from "../controllers/leaderboard.controller";

const router = Router();

router.get("/global", leaderboardController.getGlobal);
router.get("/:mode", leaderboardController.getByMode);

export default router;
