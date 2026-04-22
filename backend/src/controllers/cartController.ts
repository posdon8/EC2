import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { CartService } from "../services/cartService";
import { asyncHandler } from "../middleware/errorHandler";
interface IdParams {
  productId: string;
}
export const cartController = {
  getCart: asyncHandler(async (req: AuthRequest, res: Response) => {
    const cart = await CartService.getCart(req.userId!);

    res.status(200).json({
      success: true,
      data: cart,
    });
  }),

  addToCart: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId, quantity } = req.body;

    const cart = await CartService.addToCart(req.userId!, productId, quantity);

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  }),

  updateCartItem: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await CartService.updateCartItem(
      req.userId!,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  }),

  removeFromCart: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { productId } = req.params;

    const cart = await CartService.removeFromCart(req.userId!, productId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  }),

  clearCart: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const cart = await CartService.clearCart(req.userId!);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  }),
};
