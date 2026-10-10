import { Router } from "express";
import * as gameController from "../controllers/game.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createGameSchema } from "../validators/game.validator";

const router = Router();

router.use(authMiddleware);
router.post("/", validateRequest(createGameSchema), gameController.create);
router.get("/history", gameController.getHistory);

export default router;
