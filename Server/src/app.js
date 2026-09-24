import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth.routes.js";
import investigationRoutes from "./Routes/investigation.routes.js";

const app = express();

// Security HTTP headers (Section 24)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin API requests cleanly
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration with credentials (Section 25)
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate limiter for authentication attempts (Section 10 & 24)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
    },
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
});

app.use(cookieParser());
app.use(express.json({ limit: "1mb" })); // Request size limits (Section 24)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "DeepScout API",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", investigationRoutes);

// Centralized error handling (Section 22 & 34)
app.use((err, req, res, next) => {
  console.error("[ServerError]:", err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected internal server error occurred."
          : err.message || "An unexpected internal server error occurred.",
    },
    message: err.message || "An unexpected internal server error occurred.",
  });
});

export default app;
