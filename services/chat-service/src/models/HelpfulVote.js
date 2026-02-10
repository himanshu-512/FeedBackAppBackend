// models/HelpfulVote.js
import mongoose from "mongoose";

const helpfulVoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  },
  { timestamps: true }
);

// ONE USER → ONE VOTE
helpfulVoteSchema.index(
  { userId: 1, messageId: 1 },
  { unique: true }
);

export default mongoose.model("HelpfulVote", helpfulVoteSchema);
