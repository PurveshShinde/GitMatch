import { errorHandler } from "../utils/error.js";

/**
 * Simple in-memory rate limiter
 * Tracks IP and endpoint combinations with timestamps
 */
const rateLimitStore = new Map();

/**
 * Gets the IP address from request
 */
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    "unknown"
  );
};

/**
 * Rate limiting middleware factory
 * @param {number} maxRequests - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Error message to return
 */
export const rateLimit = (maxRequests, windowMs, message = null) => {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const endpoint = `${ip}:${req.method}:${req.path}`;
    const now = Date.now();

    // Get request history for this endpoint
    let requestTimes = rateLimitStore.get(endpoint) || [];

    // Remove old requests outside the window
    requestTimes = requestTimes.filter((time) => now - time < windowMs);

    // Check if limit exceeded
    if (requestTimes.length >= maxRequests) {
      const error = new Error(
        message || `Too many requests. Please try again later.`
      );
      error.statusCode = 429;
      return next(error);
    }

    // Add current request timestamp
    requestTimes.push(now);
    rateLimitStore.set(endpoint, requestTimes);

    // Clean up old store entries (prevent memory leak)
    if (requestTimes.length === 0) {
      rateLimitStore.delete(endpoint);
    }

    next();
  };
};

/**
 * Middleware to set rate limit headers
 */
export const addRateLimitHeaders = (maxRequests, windowMs) => {
  return (req, res, next) => {
    // These headers inform clients about rate limiting
    res.set("X-RateLimit-Limit", String(maxRequests));
    res.set("X-RateLimit-Window", String(Math.round(windowMs / 1000)));
    next();
  };
};

/**
 * Cleanup old entries periodically to prevent memory leak
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const sixHours = 6 * 60 * 60 * 1000;

  for (const [key, times] of rateLimitStore.entries()) {
    const validTimes = times.filter((time) => now - time < sixHours);
    if (validTimes.length === 0) {
      rateLimitStore.delete(key);
    } else if (validTimes.length < times.length) {
      rateLimitStore.set(key, validTimes);
    }
  }
}, 60 * 60 * 1000); // Run cleanup every hour

// Clear interval on exit
process.on("exit", () => clearInterval(cleanupInterval));

export default rateLimit;
