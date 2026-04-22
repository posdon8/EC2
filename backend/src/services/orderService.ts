import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { ApiError } from "../middleware/errorHandler";
import { Types } from "mongoose";

interface ShippingAddressData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  ward: string;
}

export class OrderService {
  static async createOrder(userId: string, shippingAddress: ShippingAddressData) {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      const error: ApiError = new Error("Cart is empty");
      error.status = 400;
      throw error;
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        const error: ApiError = new Error(
          `Product ${product?.name || "unknown"} has insufficient stock`
        );
        error.status = 400;
        throw error;
      }
    }

    // Create order
    const order = await Order.create({
      userId,
      items: cart.items,
      shippingAddress,
      totalPrice: cart.totalPrice,
      status: "pending",
      paymentMethod: "cod",
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0 });

    return order;
  }

  static async getOrders(userId: string) {
    const orders = await Order.find({ userId }).populate("items.productId").sort({ createdAt: -1 });
    return orders;
  }

  static async getOrderById(userId: string, orderId: string) {
    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "items.productId"
    );

    if (!order) {
      const error: ApiError = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      const error: ApiError = new Error("Invalid order status");
      error.status = 400;
      throw error;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      const error: ApiError = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    return order;
  }

  static async getAllOrders() {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId")
      .sort({ createdAt: -1 });
    return orders;
  }
}
