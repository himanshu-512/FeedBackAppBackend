// controllers/profile.controller.js
import axios from "axios";

export const profile = async (req, res) => {
  try {
    const token = req.headers.authorization; 
    const auth = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/me`,
      { headers: { Authorization: token }, timeout: 5000 }
    );


    const userId = auth.data.userId;
    if (!userId) throw new Error("userId missing from auth response");

    
    const chat = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/messages/stats/${userId}`,
      { headers: { Authorization: token }, timeout: 5000 }
    );

    const wallet = await axios.get(
      `${process.env.WALLET_SERVICE_URL}/profile-summary`,
      { headers: { Authorization: token }, timeout: 5000 }
    );

    return res.json({
      username: auth.data.username,
      isAnonymous: auth.data.isAnonymous,
      stats: chat.data,
      wallet: wallet.data,
    });
  } catch (err) {
    console.error("Message:", err.message);

    if (err.config) {
  
      console.error("Method:", err.config.method);
    }

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", err.response.data);
    } else {
      console.error("No response received");
    }

    return res.status(500).json({ message: "Failed to load profile" });
  }
};
