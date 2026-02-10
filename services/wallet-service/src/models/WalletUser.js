import mongoose from "mongoose";

const walletUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // comes from Auth Service
      required: true,
      unique: true,
    },

    wallet: {
      points: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
    },

    badge: {
      name: String,
      icon: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WalletUser", walletUserSchema);
