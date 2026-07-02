import { Router, type Request, type Response } from "express";
import { authController } from "./auth.controller";
import { userController } from "../user/user.controller";

const router = Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);

export const authRoute = router;
