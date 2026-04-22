import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.post("/logout", authMiddleware, authController.logout);

export default router;
