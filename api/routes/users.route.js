import express from "express";
import {
  savePublicKey,
  lookupUser,
  updateProfile,
  unlinkGithub,
} from "../controllers/users.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/users/public-key
router.post("/public-key", protectRoute, savePublicKey);

// GET /api/users/lookup?githubUsername=...
// Resolves a GitHub username to a GitMatch user (MongoDB lookup, replaces Firestore scan)
router.get("/lookup", protectRoute, lookupUser);

// POST /api/users/update-profile
router.post("/update-profile", protectRoute, updateProfile);

// POST /api/users/unlink-github
router.post("/unlink-github", protectRoute, unlinkGithub);

export default router;
