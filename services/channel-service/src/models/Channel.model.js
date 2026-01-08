import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 search ke liye
    },

    description: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String, // anonUserId
      required: true,
    },

    members: {
      type: [String], // anonUserIds
      default: [],
    },

    isOfficial: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
