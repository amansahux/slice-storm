
import { Router } from "express";
import * as gameSessionController from "../controllers/gameSession.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  createGameSessionSchema,
  updateGameSessionSchema,
} from "../validators/gameSession.validator";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest(createGameSessionSchema),
  gameSessionController.create
);

router.patch(
  "/:sessionId/status",
  validateRequest(updateGameSessionSchema),
  gameSessionController.updateStatus
);

export default router;
