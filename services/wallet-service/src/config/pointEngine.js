import Transaction from "../models/transaction.model.js";
import { getBadge } from "./badge.js";

/**
 * wallet = Wallet document
 */
export async function addPoints(wallet, points, reason) {
  // 1️⃣ Add points
  wallet.points += points;

  // 2️⃣ Create POINT CREDIT transaction
  await Transaction.create({
    userId: wallet.userId,   // ✅ auth user id
    amount: points,          // ✅ points here
    type: "credit",          // ✅ valid enum
    title: reason,           // e.g. "Message sent"
  });

  let converted = 0;

  // 3️⃣ Auto convert points → ₹
  while (wallet.points >= 1000) {
    wallet.points -= 1000;
    wallet.balance += 1;
    converted++;

    // 🔻 Debit points
    await Transaction.create({
      userId: wallet.userId,
      amount: 1000,
      type: "debit",
      title: "Points converted to wallet",
    });

    // 🔺 Credit money
    await Transaction.create({
      userId: wallet.userId,
      amount: 1,
      type: "credit",
      title: "Wallet credited",
    });
  }

  // 4️⃣ Update badge (your logic)
  wallet.badge = getBadge(wallet.points);

  // 5️⃣ Save wallet
  await wallet.save();

  return {
    points: wallet.points,
    balance: wallet.balance,
    converted,
    badge: wallet.badge,
  };
}
