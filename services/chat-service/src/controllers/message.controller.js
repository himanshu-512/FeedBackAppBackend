import Message from "../models/Message.js";

export const createMessage = async ({ channelId, userId, username, text }) => {
  if (!channelId || !userId || !text) {
    throw new Error("Invalid message data");
  }

  if (text.length > 500) {
    throw new Error("Message too long");
  }

  const message = await Message.create({
    channelId,
    userId,
    username,
    text,
  });

  return message;
};
// GET /messages/:channelId
export const getMessagesByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID required" });
    }

    const messages = await Message.find({ channelId })
      .sort({ createdAt: 1 }) // 🔥 oldest → newest
      .limit(500)             // 🔥 safety limit
      .lean();

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
