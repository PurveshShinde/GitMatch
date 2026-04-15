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

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get("/verify-email", verifyEmail);
router.post("/resend-verify", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/onboarding", protectRoute, saveOnboarding);
router.get("/me", protectRoute, getMe);
router.post("/signout", protectRoute, signout);

export default router;
