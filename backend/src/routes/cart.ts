import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/:productId", cartController.updateCartItem);
router.delete("/:productId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

export default router;
