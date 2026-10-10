import { Router } from "express";
import * as settingController from "../controllers/setting.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { updateSettingsSchema } from "../validators/user.validator";

const router = Router();

router.use(authMiddleware);
router.get("/", settingController.get);
router.patch("/", validateRequest(updateSettingsSchema), settingController.update);

export default router;
