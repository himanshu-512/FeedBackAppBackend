import Wallet from "../models/wallet.model.js";
import Transaction from "../models/transaction.model.js";
import { getBadge } from "../config/badge.js";
export const getSummary = async (req, res) => {
  const userId = req.user.id;

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEarning = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: "credit",
        createdAt: { $gte: today },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    balance: wallet.balance,
    today: todayEarning[0]?.total || 0,
    total: wallet.balance,
    points: wallet.points,
  });
};

export const getTransactions = async (req, res) => {
  const tx = await Transaction.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(tx);
};

/* 🔥 CREDIT (used by channel-service later) */
export const creditWallet = async (req, res) => {
  const { userId, amount, title, channel, points = 0 } = req.body;

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    {
      $inc: {
        balance: amount,
        points: points,
      },
    },
    { upsert: true, new: true }
  );

  await Transaction.create({
    userId,
    amount,
    type: "credit",
    title,
    channel,
  });

  res.json({
    success: true,
    balance: wallet.balance,
    points: wallet.points,
  });
};


/**
 * GET /wallet/profile-summary
 * Used ONLY by Settings/Profile face
 */
export const getProfileSummary = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: userId missing",
      });
    }

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        points: 0,
      });
    }

    const points = wallet.points ?? 0;

    const badge = getBadge(points);

    return res.json({
      points,
      badge,
    });
  } catch (err) {
    console.error("Error message:", err.message);
    console.error("Stack:", err.stack);

    return res.status(500).json({
      message: "Failed to load profile summary",
    });
  }
};