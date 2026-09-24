import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "deepscout_secure_jwt_secret_key_prod_2026";

export const extractToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

export const requireAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required. Please sign in.",
      },
      // Backward-compatibility string
      message: "Authentication required. Please sign in.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      throw new Error("Invalid token payload");
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "SESSION_EXPIRED",
        message: "Your session has expired. Please sign in again.",
      },
      message: "Your session has expired. Please sign in again.",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.id) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
};
