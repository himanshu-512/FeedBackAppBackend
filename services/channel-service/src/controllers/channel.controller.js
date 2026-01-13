import Channel from "../models/Channel.model.js";

// GET /channels
export const listChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .sort({ createdAt: -1 })
      .limit(50) // 🔥 safety
      .lean();

    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};

// POST /channels
export const createChannel = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.headers["x-user-id"];

    if (!name) {
      return res.status(400).json({ message: "Channel name required" });
    }

    const channel = await Channel.create({
      name,
      createdBy: userId,
      members: [userId],
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// POST /channels/:id/join
export const joinChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user.userId; // JWT se aa raha hai

    const channel = await Channel.findByIdAndUpdate(
      channelId,
      {
        $addToSet: { members: userId }, // 🔥 duplicate safe
      },
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json({
      message: "Joined channel successfully",
      membersCount: channel.members.length,
      channel,
    });
  } catch (err) {
    console.error("JOIN CHANNEL ERROR:", err.message);
    res.status(500).json({ message: "Failed to join channel" });
  }
};
