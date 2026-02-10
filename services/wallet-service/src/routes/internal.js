import express from "express";
import Wallet from "../models/wallet.model.js";
import { addPoints } from "../config/pointEngine.js";
import { getBadge } from "../config/badge.js";

const router = express.Router();

// 🔐 simple internal auth
router.use((req, res, next) => {
  if (req.headers["x-internal-secret"] !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized service" });
  }
  next();
});

// 🔥 POINT ENTRY API
router.post("/points", async (req, res) => {
  console.log("🔥 INTERNAL POINTS API HIT", req.body);

  const { userId, action } = req.body;
console.log("Received points request:", { userId, action });
  if (!userId || !action) {
    return res.status(400).json({ error: "Missing userId or action" });
  }

  // 1️⃣ Find wallet
  let wallet = await Wallet.findOne({ userId });

  // 2️⃣ Create wallet if not exists
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      points: 0,
      badge: getBadge(0),
    });
  }

  // 3️⃣ Decide points + reason
  let points = 0;
  let reason = "";

  if (action === "MESSAGE") {
    points = 1;
    reason = "Message sent";
  } else if (action === "REPLY") {
    points = 2;
    reason = "Reply sent";
  } else if (action === "HELPFUL_VOTE") {
    points = 10;
    reason = "Helpful vote received";
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  // 4️⃣ Add points (CORRECT CALL)
  const result = await addPoints(wallet, points, reason);

  res.json({
    success: true,
    wallet: result,
  });
});

export default router;
