import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ReviewService } from "../services/reviewService";
import { asyncHandler } from "../middleware/errorHandler";
interface productParams {
  productId: string;
}
interface IdParams {
  id: string;
}
export const reviewController = {
  createReview: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId, rating, comment } = req.body;

    const review = await ReviewService.createReview(req.userId!, {
      productId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }),

  getReviews: asyncHandler(async (req: AuthRequest<productParams>, res: Response) => {
    const { productId } = req.params;

    const reviews = await ReviewService.getReviews(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  }),

  deleteReview: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;

    const review = await ReviewService.deleteReview(req.userId!, id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  }),
};
