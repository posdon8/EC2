import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "../config";
import { ApiError } from "../middleware/errorHandler";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      const error: ApiError = new Error("Email already exists");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "customer",
    });

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  static async login(data: LoginData) {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      const error: ApiError = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await bcryptjs.compare(
      data.password,
      user.password || ""
    );
    if (!isPasswordValid) {
      const error: ApiError = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async loginWithGoogle(googleData: any) {
    let user = await User.findOne({ email: googleData.email });

    if (!user) {
      user = await User.create({
        email: googleData.email,
        name: googleData.name,
        googleId: googleData.id,
        image: googleData.image,
        role: "customer",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);

    if (!user) {
      const error: ApiError = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Verify old password
    const isPasswordValid = await bcryptjs.compare(
      oldPassword,
      user.password || ""
    );
    if (!isPasswordValid) {
      const error: ApiError = new Error("Current password is incorrect");
      error.status = 401;
      throw error;
    }

    // Hash new password and update
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
