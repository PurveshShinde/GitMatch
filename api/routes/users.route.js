import express from "express";
import { savePublicKey, lookupUser } from "../controllers/users.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/users/public-key
router.post("/public-key", protectRoute, savePublicKey);

// GET /api/users/lookup?githubUsername=...
// Resolves a GitHub username to a GitMatch user (MongoDB lookup, replaces Firestore scan)
router.get("/lookup", protectRoute, lookupUser);

export default router;
