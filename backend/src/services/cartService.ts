import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { ApiError } from "../middleware/errorHandler";
import { Types } from "mongoose";

export class CartService {
  static async getCart(userId: string) {
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalPrice: 0 });
    }

    return cart;
  }

  static async addToCart(userId: string, productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) {
      const error: ApiError = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error: ApiError = new Error("Insufficient stock");
      error.status = 400;
      throw error;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId: new Types.ObjectId(productId), quantity, price: product.price });
      }

      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      await cart.save();
    }

    return cart;
  }

  static async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const error: ApiError = new Error("Cart not found");
      error.status = 404;
      throw error;
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      const error: ApiError = new Error("Item not in cart");
      error.status = 404;
      throw error;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    return cart;
  }

  static async removeFromCart(userId: string, productId: string) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const error: ApiError = new Error("Cart not found");
      error.status = 404;
      throw error;
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    return cart;
  }

  static async clearCart(userId: string) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const error: ApiError = new Error("Cart not found");
      error.status = 404;
      throw error;
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return cart;
  }
}
