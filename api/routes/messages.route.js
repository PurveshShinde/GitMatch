import express from "express";
import { getMessages } from "../controllers/messages.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/messages/:chatId — fetch history for a chat room (last 50 messages)
router.get("/:chatId", protectRoute, getMessages);

export default router;
