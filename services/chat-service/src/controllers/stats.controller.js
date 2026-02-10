// controllers/stats.controller.js
import Message from "../models/message.model.js";
export const getUserStats = async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.countDocuments({ userId });
//   const helpfulVotes = await Vote.countDocuments({
//     receiverId: userId,
//     type: "helpful",
//   });

  res.json({
    messages,
    helpfulVotes: 0, // Default value since helpful votes are not implemented
  });

  
};
