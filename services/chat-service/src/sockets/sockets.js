import axios from "axios";
import Message from "../models/message.model.js";
import { awardPoints } from "../config/walletClient.js";

const CHANNEL_SERVICE_URL = process.env.CHANNEL_SERVICE_URL;

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    /* =========================
       JOIN CHANNEL
    ========================= */
    socket.on("joinChannel", ({ channelId }) => {
      socket.join(channelId);
    });

    /* =========================
       SEND MESSAGE (NORMAL + REPLY)
    ========================= */
    socket.on("sendMessage", async (data) => {
      try {
        const {
          channelId,
          userId,
          username,
          text,
          parentId = null, // 🔥 NEW
        } = data;

        if (!channelId || !userId || !text) return;

        // 🔥 CHECK MEMBERSHIP (SOURCE OF TRUTH)
        const res = await axios.get(
          `${CHANNEL_SERVICE_URL}/${channelId}/is-member/${userId}`,
        );

        if (!res.data.isMember) {
          socket.emit("errorMessage", {
            message: "You must join this channel to chat",
          });
          return;
        }

        // ✅ SAVE MESSAGE (WITH parentId)
        const message = await Message.create({
          channelId,
          userId,
          username,
          text,
          parentId,
        });

        console.log("Message created:", message._id);

        awardPoints({
          userId,
          action: "MESSAGE",
        });
        console.log(
          `Message created by user ${userId} in channel ${channelId}, awarded points.`,
        );

        io.to(channelId).emit("newMessage", message);
      } catch (err) {
        console.log("SEND MESSAGE ERROR:", err.message);
        socket.emit("errorMessage", {
          message: "Message failed",
        });
      }
    });

    /* =========================
       UPVOTE MESSAGE (TOGGLE)
    ========================= */
    socket.on("upvoteMessage", async ({ messageId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        const index = message.upvotes.indexOf(userId);

        if (index === -1) {
          message.upvotes.push(userId);
        } else {
          message.upvotes.splice(index, 1);
        }

        await message.save();

        io.to(message.channelId.toString()).emit("messageUpdated", message);
      } catch (err) {
        console.log("UPVOTE ERROR:", err.message);
      }
    });

    /* =========================
       EMOJI REACTION (TOGGLE)
    ========================= */
    socket.on("reactMessage", async ({ messageId, emoji, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        const users = message.reactions.get(emoji) || [];

        if (users.includes(userId)) {
          message.reactions.set(
            emoji,
            users.filter((u) => u !== userId),
          );
        } else {
          message.reactions.set(emoji, [...users, userId]);
        }

        await message.save();

        io.to(message.channelId.toString()).emit("messageUpdated", message);
      } catch (err) {
        console.log("REACTION ERROR:", err.message);
      }
    });
  });
};

export default chatSocket;
