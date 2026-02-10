import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true,
    },

    userId: {
      type: String, // anonymous user id
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },

    /* 🔥 NEW: Reply support */
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    /* 🔥 NEW: Upvotes */
    upvotes: {
      type: [String], // userIds
      default: [],
    },

    /* 🔥 FIXED: Emoji reactions */
    reactions: {
      type: Map,
      of: [String], // { "❤️": ["user1", "user2"] }
      default: {},
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔥 IMPORTANT INDEX */
messageSchema.index({ channelId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
