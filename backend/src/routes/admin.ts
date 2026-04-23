import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// User Management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Dashboard Stats
router.get("/stats", adminController.getDashboardStats);

export default router;
