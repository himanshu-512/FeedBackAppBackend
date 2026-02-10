import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";

// 🔹 Routers
import authRouter from "./routes/auth.routes.js";
import channelRouter from "./routes/channel.routes.js";
import messageRouter from "../src/routes/massage.routes.js";
import walletRouter from "./routes/wallet.routes.js";
import profileRouter from "./routes/profile.router.js";
const app = express();
const server = http.createServer(app);


app.use("/auth", authRouter);
app.use("/channels", channelRouter);
app.use("/messages", messageRouter);
app.use("/wallet", walletRouter);
app.use("/profile", profileRouter);

/* =======================
   🌐 GLOBAL MIDDLEWARES
======================= */
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/* =======================
   🔀 API ROUTES
======================= */

/* =======================
   ❤️ HEALTH CHECK
======================= */
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

/* =======================
   🔥 SOCKET.IO GATEWAY
======================= */
const io = new Server(server, {
  cors: { origin: "*" },
});

/**
 * 🔁 Gateway → Chat Service socket
 * Docker DNS name = chat-service
 */
const chatSocket = Client("http://chat-service:4003", {
  transports: ["websocket"],
});

chatSocket.on("connect", () => {
  console.log("🔁 Gateway connected to Chat Service socket");
});

chatSocket.on("disconnect", () => {
  console.log("⚠️ Gateway disconnected from Chat Service socket");
});

/* =======================
   📱 MOBILE SOCKET FLOW
======================= */
io.on("connection", (socket) => {
  console.log("📱 Mobile connected to Gateway socket");

  socket.on("joinChannel", (data) => {
    chatSocket.emit("joinChannel", data);
  });

  socket.on("sendMessage", (data) => {
    chatSocket.emit("sendMessage", data);
  });

  chatSocket.on("newMessage", (msg) => {
    socket.emit("newMessage", msg);
  });

  chatSocket.on("errorMessage", (err) => {
    socket.emit("errorMessage", err);
  });

  socket.on("disconnect", () => {
    console.log("📱 Mobile disconnected from Gateway socket");
  });
});

/* =======================
   🚀 START SERVER
======================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
