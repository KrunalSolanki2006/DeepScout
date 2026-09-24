import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../Model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "deepscout_secure_jwt_secret_key_prod_2026";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Name validation
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_NAME",
        message: "Name is required and must be at least 2 characters.",
      },
      message: "Name is required and must be at least 2 characters.",
    });
  }

  // Email validation & normalization
  const normalizedEmail = (email || "").toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_EMAIL",
        message: "Please provide a valid email address.",
      },
      message: "Please provide a valid email address.",
    });
  }

  // Password validation
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        code: "WEAK_PASSWORD",
        message: "Password must be at least 6 characters long.",
      },
      message: "Password must be at least 6 characters long.",
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database is not connected. Please verify your MONGODB_URI and IP whitelist in MongoDB Atlas.",
      },
      message: "Database is not connected. Please verify your MONGODB_URI and IP whitelist in MongoDB Atlas.",
    });
  }

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "An account with this email address already exists.",
        },
        message: "An account with this email address already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      lastLoginAt: new Date(),
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    const safeUser = user.toSafeObject();

    return res.status(201).json({
      success: true,
      data: { user: safeUser },
      user: safeUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "REGISTRATION_FAILED",
        message: "Unable to create account. Please try again.",
      },
      message: "Unable to create account. Please try again.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = (email || "").toLowerCase().trim();
  if (!normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_CREDENTIALS",
        message: "Email and password are required.",
      },
      message: "Email and password are required.",
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database is not connected. Please verify your MONGODB_URI and IP whitelist in MongoDB Atlas.",
      },
      message: "Database is not connected. Please verify your MONGODB_URI and IP whitelist in MongoDB Atlas.",
    });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Incorrect email or password.",
        },
        message: "Incorrect email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Incorrect email or password.",
        },
        message: "Incorrect email or password.",
      });
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    const safeUser = user.toSafeObject();

    return res.json({
      success: true,
      data: { user: safeUser },
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "LOGIN_FAILED",
        message: "Unable to sign in. Please try again.",
      },
      message: "Unable to sign in. Please try again.",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({
    success: true,
    message: "Signed out successfully",
  });
};

export const getMe = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    // If DB is offline but user token is valid
    return res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
      },
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User session not found.",
        },
        message: "User session not found.",
      });
    }

    const safeUser = user.toSafeObject();

    return res.json({
      success: true,
      data: { user: safeUser },
      user: safeUser,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SESSION_ERROR",
        message: "Session verification error.",
      },
      message: "Session verification error.",
    });
  }
};
