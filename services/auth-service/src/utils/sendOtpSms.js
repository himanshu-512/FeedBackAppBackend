import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Twilio = require("twilio"); // 👈 FORCE CommonJS

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOtpSms(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`,
    });

    console.log("✅ SMS SENT:", message.sid);
    return true;
  } catch (error) {
    console.error("❌ TWILIO ERROR:", error.message);
    throw new Error("SMS failed");
  }
}
