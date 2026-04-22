import { Review } from "../models/Review";
import { Product } from "../models/Product";
import { ApiError } from "../middleware/errorHandler";

interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export class ReviewService {
  static async createReview(userId: string, data: CreateReviewData) {
    const product = await Product.findById(data.productId);
    if (!product) {
      const error: ApiError = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    const existingReview = await Review.findOne({
      productId: data.productId,
      userId,
    });

    if (existingReview) {
      const error: ApiError = new Error("You already reviewed this product");
      error.status = 400;
      throw error;
    }

    const review = await Review.create({
      productId: data.productId,
      userId,
      rating: data.rating,
      comment: data.comment,
    });

    // Update product rating
    const reviews = await Review.find({ productId: data.productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(data.productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    return review;
  }

  static async getReviews(productId: string) {
    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    return reviews;
  }

  static async deleteReview(userId: string, reviewId: string) {
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      const error: ApiError = new Error("Review not found");
      error.status = 404;
      throw error;
    }

    await Review.deleteOne({ _id: reviewId });

    // Update product rating
    const reviews = await Review.find({ productId: review.productId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(review.productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    return review;
  }
}
