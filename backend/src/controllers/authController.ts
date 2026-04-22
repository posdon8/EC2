import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AuthService } from "../services/authService";
import { asyncHandler } from "../middleware/errorHandler";

export const authController = {
  register: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, name } = req.body;

    const user = await AuthService.register({ email, password, name });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }),

  login: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }),

  googleLogin: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { googleData } = req.body;

    const result = await AuthService.loginWithGoogle(googleData);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: result,
    });
  }),

  logout: asyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }),
};
