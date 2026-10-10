import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { registerUserSchema, loginUserSchema } from "../validators/user.validator";

const router = Router();

router.post("/register", validateRequest(registerUserSchema), userController.register);
router.post("/login", validateRequest(loginUserSchema), userController.login);
router.get("/profile", authMiddleware, userController.getProfile);

export default router;
