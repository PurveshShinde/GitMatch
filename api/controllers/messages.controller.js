import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";

/**
 * GET /api/messages/:chatId
 * Returns the last 50 messages for a chat room.
 * Security: only participants (whose IDs make up the chatId) can fetch.
 */
export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // chatId is made of two sorted MongoDB user IDs joined by "_"
    const participantIds = chatId.split("_");
    if (participantIds.length !== 2) {
      return next(errorHandler(400, "Invalid chatId format."));
    }

    // Verify the requesting user is one of the two participants
    const userId = req.user.id.toString();
    const isParticipant = participantIds.some(id => id.toString() === userId);

    if (!isParticipant) {
      console.error(`[GET-MESSAGES] Access Denied. User ID: "${userId}", Participants: [${participantIds.map(id => `"${id}"`).join(", ")}]`);
      return next(errorHandler(403, "Access denied: you are not a participant in this chat."));
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();

    // Serialize ObjectIds to strings for consistent client-side comparison
    const formatted = messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
    }));

    return res.json({ success: true, messages: formatted });
  } catch (err) {
    return next(err);
  }
};
