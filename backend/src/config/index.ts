import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
