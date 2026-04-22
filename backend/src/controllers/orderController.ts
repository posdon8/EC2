import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { OrderService } from "../services/orderService";
import { asyncHandler } from "../middleware/errorHandler";
interface IdParams {
  id: string;
}
export const orderController = {
  createOrder: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { shippingAddress } = req.body;

    const order = await OrderService.createOrder(req.userId!, shippingAddress);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  }),

  getOrders: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const orders = await OrderService.getOrders(req.userId!);

    res.status(200).json({
      success: true,
      data: orders,
    });
  }),

  getOrderById: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;

    const order = await OrderService.getOrderById(req.userId!, id);

    res.status(200).json({
      success: true,
      data: order,
    });
  }),

  updateOrderStatus: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  }),

  getAllOrders: asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await OrderService.getAllOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  }),
};
