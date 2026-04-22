import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", adminMiddleware, orderController.updateOrderStatus);
router.get("/admin/all-orders", adminMiddleware, orderController.getAllOrders);

export default router;
