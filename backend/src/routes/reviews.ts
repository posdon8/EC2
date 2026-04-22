import { Router } from "express";
import { reviewController } from "../controllers/reviewController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, reviewController.createReview);
router.get("/:productId", reviewController.getReviews);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

export default router;
