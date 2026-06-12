import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.route.js";
import issuesRoutes from "./routes/issues.route.js";
import usersRoutes from "./routes/users.route.js";
import messagesRoutes from "./routes/messages.route.js";
import Message from "./models/message.model.js";
import User from "./models/user.model.js";

import { seedSkillTaxonomy } from "./data/skillTaxonomySeed.js";
import { loadTaxonomy } from "./services/skillExtraction.service.js";

// Hello
dotenv.config();

// Workaround for Node.js 22 + MongoDB Atlas TLS issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

mongoose
  .connect(process.env.MONGO, { family: 4 })
  .then(async () => {
    console.log("Connected to MongoDB!!!");
    await seedSkillTaxonomy();
    await loadTaxonomy();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://gitmatch-delta.vercel.app"
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ─── REST Routes ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message });
});

// ─── HTTP Server + Socket.io ──────────────────────────────────────────────────
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/api/socket.io",
  cors: {
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://gitmatch-delta.vercel.app"
    ].filter(Boolean),
    credentials: true,
  },
});

// Socket auth middleware — verify JWT from handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.id; // string (ObjectId serialized in JWT)
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// Socket event handlers
io.on("connection", (socket) => {
  // Join a chat room (called when user opens a conversation)
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  // Leave a chat room (called when user switches conversation)
  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  // Send a message — save to MongoDB then broadcast to room
  socket.on("sendMessage", async ({ chatId, text }) => {
    if (!text?.trim() || !chatId) return;

    // Security: sender must be one of the two participants
    const participantIds = chatId.split("_");
    const userId = socket.data.userId.toString();

    console.log(`[SOCKET] sendMessage attempt. User: ${userId}, Room: ${chatId}`);

    if (!participantIds.some(id => id.toString() === userId)) {
      console.warn(`[SOCKET] Permission denied for sendMessage. User ${userId} is not in participants:`, participantIds);
      return;
    }

    try {
      // Lazy-load sender name from DB (cached after first message per session)
      if (!socket.data.senderName) {
        const user = await User.findById(socket.data.userId)
          .select("username")
          .lean();
        socket.data.senderName = user?.username || "User";
      }

      const message = await Message.create({
        chatId,
        senderId: socket.data.userId,
        senderName: socket.data.senderName,
        text: text.trim(),
      });

      console.log(`[SOCKET] Message saved. ID: ${message._id}, Room: ${chatId}`);

      // Broadcast to everyone in room (including sender) for consistent state
      io.to(chatId).emit("newMessage", {
        _id: message._id.toString(),
        chatId,
        senderId: socket.data.userId,
        senderName: socket.data.senderName,
        text: text.trim(),
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("[Socket] sendMessage error:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});
