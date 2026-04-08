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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    return next(errorHandler(401, "Unauthorized: invalid token"));
  }
};

export const protectRoute = verifyToken;
