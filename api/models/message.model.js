import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
  },
  { timestamps: true }
);

// Compound index for efficient chat history queries (sorted by time)
messageSchema.index({ chatId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
