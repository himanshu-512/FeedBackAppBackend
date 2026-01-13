import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import authRouter from '../src/routes/auth.routes.js'
import channelRouter from '../src/routes/channel.routes.js'
import messageRouter from '../src/routes/massage.routes.js'
const app = express();

// /* 🔥 AUTH PROXY — MUST BE FIRST */
// app.use(
//   "/auth",
//   createProxyMiddleware({
//     target: "http://127.0.0.1:4001", // Auth Service
//     changeOrigin: true,
//     pathRewrite: {
//       "^/auth": "",
//     },
//     logLevel: "debug",

//     onProxyReq(proxyReq, req) {
//       console.log("🔁 PROXY → AUTH:", proxyReq.path);
//     },

//     onProxyRes(proxyRes) {
//       console.log("✅ AUTH RESPONSE:", proxyRes.statusCode);
//     },

//     onError(err) {
//       console.error("❌ PROXY ERROR:", err.message);
//     },
//   })
// );

app.use("/auth",authRouter)
app.use("/channels",channelRouter)
app.use("/messages",messageRouter)

/* MIDDLEWARES (AFTER PROXY) */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/* LOGGER */
app.use((req, res, next) => {
  console.log("➡️ GATEWAY HIT:", req.method, req.originalUrl);
  next();
});

/* HEALTH */
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
