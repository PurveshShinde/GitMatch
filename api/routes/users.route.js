import express from "express";
import {
  savePublicKey,
  lookupUser,
  updateProfile,
  unlinkGithub,
  getCommunityUsers,
  syncGithubStats,
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

// GET /api/users/community
router.get("/community", protectRoute, getCommunityUsers);

// POST /api/users/sync-github
router.post("/sync-github", protectRoute, syncGithubStats);

export default router;
