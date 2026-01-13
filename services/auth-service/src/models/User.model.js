import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
