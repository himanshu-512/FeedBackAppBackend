import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // auth service user id
      unique: true,
      required: true,
    },

    // 💰 Used for money / credits / coins (already in use)
    balance: {
      type: Number,
      default: 0,
    },

    // ⭐ Used for profile reputation / points
    points: {
      type: Number,
      default: 0,
    },
    badge: {
      name: String,
      icon: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Wallet", walletSchema);
