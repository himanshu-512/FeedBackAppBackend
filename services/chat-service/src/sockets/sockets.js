import { createMessage } from "../controllers/message.controller.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChannel", ({ channelId }) => {
      socket.join(channelId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const message = await createMessage(data);
        io.to(data.channelId).emit("newMessage", message);
      } catch (err) {
        socket.emit("errorMessage", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
