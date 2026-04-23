import express from "express";
import {
	signin,
	signout,
	signup,
	googleAuth,
	verifyEmail,
	resendVerificationEmail,
	forgotPassword,
	resetPassword,
	saveOnboarding,
	getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Rate limiting: 5 signup attempts per 15 minutes per IP
router.post("/signup", rateLimit(5, 15 * 60 * 1000, "Too many signup attempts. Please try again later."), signup);

// Rate limiting: 5 signin attempts per 5 minutes per IP
router.post("/signin", rateLimit(5, 5 * 60 * 1000, "Too many signin attempts. Please try again later."), signin);

// Rate limiting: 3 password reset requests per hour per IP
router.post("/forgot-password", rateLimit(3, 60 * 60 * 1000, "Too many password reset requests. Please try again later."), forgotPassword);

// Rate limiting: 5 reset attempts per 15 minutes per IP
router.post("/reset-password", rateLimit(5, 15 * 60 * 1000, "Too many reset attempts. Please try again later."), resetPassword);

// Rate limiting: 5 resend attempts per 15 minutes per IP
router.post("/resend-verify", rateLimit(5, 15 * 60 * 1000, "Too many resend attempts. Please try again later."), resendVerificationEmail);

// Google auth (no rate limit; less sensitive)
router.post("/google", googleAuth);

// Email verification (no rate limit needed; uses token)
router.get("/verify-email", verifyEmail);

// Protected routes (require authentication)
router.post("/onboarding", protectRoute, saveOnboarding);
router.get("/me", protectRoute, getMe);
router.post("/signout", protectRoute, signout);

export default router;

