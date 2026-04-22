import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "./errorHandler";

export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  role?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const error: ApiError = new Error("No token provided");
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error: any) {
    const err: ApiError = new Error(error.message || "Invalid token");
    err.status = 401;
    next(err);
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== "admin") {
    const error: ApiError = new Error("Admin access only");
    error.status = 403;
    return next(error);
  }
  next();
};
