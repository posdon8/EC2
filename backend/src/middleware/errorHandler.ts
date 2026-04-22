import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  status?: number;
  message: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${status}] ${message}`, err);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err }),
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
