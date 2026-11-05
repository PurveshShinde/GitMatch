import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  return null;
};

export const verifyToken = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(errorHandler(401, "Unauthorized: token missing"));
  }

  if (!process.env.JWT_SECRET) {
    console.error("[Auth] CRITICAL: JWT_SECRET environment variable is missing on server!");
    return next(
      errorHandler(500, "Server configuration error: JWT_SECRET is not configured")
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    console.warn(`[Auth] verifyToken failed (${error.name}): ${error.message}`);
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired: please sign in again"
        : "Unauthorized: invalid token";
    return next(errorHandler(401, message));
  }
};

export const protectRoute = verifyToken;
