import express from "express";
import {
	getRecommended,
	getIssueById,
	submitFeedback,
	reindexIssues,
} from "../controllers/issues.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All issue routes require authentication
router.get("/recommended", protectRoute, getRecommended);
router.get("/:githubId", protectRoute, getIssueById);
router.post("/feedback", protectRoute, submitFeedback);
router.post("/reindex", protectRoute, reindexIssues);

export default router;
