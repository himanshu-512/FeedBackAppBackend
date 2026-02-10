import axios from "axios";

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

export async function awardPoints({ userId, action }) {
    console.log(`Awarding points for user ${userId} and action ${action}`);
  try {
    await axios.post(
      `${WALLET_SERVICE_URL}/internal/points`,
      { userId, action },
      {
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
          "Content-Type": "application/json",
        },
        timeout: 2000, // ⏱️ don’t block chat
      }
    );
    console.log("request to wallet service successful");
  } catch (err) {
    // 🔥 VERY IMPORTANT: do NOT throw
    console.error(
      "Wallet service failed:",
      err.response?.data || err.message
    );
  }
}
