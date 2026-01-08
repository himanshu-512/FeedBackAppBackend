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
      type: String, // anon user id
      required: true,
      index: true,
    },

    username: {
      type: String, // snapshot (anonymous name at send time)
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 500, // 🔥 safety
      trim: true,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
