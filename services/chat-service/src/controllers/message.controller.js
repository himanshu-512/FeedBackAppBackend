import Message from "../models/message.model.js";
import { awardPoints } from "../config/walletClient.js";
/* 📨 CREATE MESSAGE (USED BY SOCKET / API) */


export const createMessage = async ({
  channelId,
  userId,
  username,
  text,
}) => {
  if (!channelId || !userId || !text) {
    throw new Error("Invalid message data");
  }

  if (text.length > 500) {
    throw new Error("Message too long");
  }

  const message = await Message.create({
    channelId,
    userId,
    username: username || "Anonymous",
    text,
  });
  console.log("Message created:", message._id);

  // 🔥 POINT EVENT (async, non-blocking)
 

  return message;
};

/* 📥 GET /messages/:channelId */
export const getMessagesByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID required" });
    }

    const query = {
      channelId,
      isDeleted: false, // 🔥 deleted messages hide
    };

    // 🔁 Cursor-based pagination
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // newest → oldest
      .limit(Number(limit))
      .lean();

    res.json({
      messages: messages.reverse(), // oldest → newest (UI friendly)
      hasMore: messages.length === Number(limit),
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
