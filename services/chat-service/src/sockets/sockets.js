import { createMessage } from "../controllers/message.controller.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChannel", ({ channelId }) => {
      socket.join(channelId);
    });

    socket.on('sendMessage', async (data) => {
  const { channelId, userId, username, text } = data;

  if (!channelId || !userId || !text) return;

  // 🔐 CHECK MEMBERSHIP
  const channel = await channel.findById(channelId);

  if (!channel) {
    socket.emit("errorMessage", { message: "Channel not found" });
    return;
  }

  if (!channel.members.includes(userId)) {
    socket.emit("errorMessage", {
      message: "You must join this channel to send messages"
    });
    return;
  }

  // ✅ ALLOWED
  const message = await message.create({
    channelId,
    userId,
    username,
    text
  });

  io.to(channelId).emit("newMessage", message);
});

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
