import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/errorHandler";

interface IdParams {
  id: string;
}

export const adminController = {
  // User Management
  getAllUsers: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }),

  getUserById: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  updateUserRole: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'customer' or 'admin'",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  }),

  deleteUser: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;

    // Prevent deleting the requesting admin
    if (id === req.userId) {
      res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }),

  // Dashboard Stats
  getDashboardStats: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { Order } = await import("../models/Order");
    const { Product } = await import("../models/Product");

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ["delivered", "shipped"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  }),
};
