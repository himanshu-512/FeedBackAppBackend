import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from '../utils/username.js';
// import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { sendOtpSms } from "../utils/sendOtpSms.js";
// import { generateUsername } from "../utils/username.js";
import Otp from "../models/otp.model.js";
// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined');
// }
import fetch from "node-fetch";
export function anonymousLogin(req, res) {
  try {
    const userId = uuidv4();
    const username = generateUsername();

    const token = jwt.sign(
      {
        userId,
        username,
        role: 'anonymous'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      userId,
      username,
      token
    });
  } catch (error) {
    console.error('Anonymous login error:', error);
    res.status(500).json({
      success: false,
      message: 'Anonymous login failed'
    });
  }
}


export const verifyPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log("VERIFY PHONE:", phone);

    if (!phone) {
      return res.status(400).json({ message: "Phone required" });
    }

    // 1️⃣ Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        username: generateUsername(),
      });
    }

    // 2️⃣ Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 3️⃣ Respond
    res.json({
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error("VERIFY PHONE ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT se aaya
    console.log("GET ME:", userId);

    let user = await User.findById(userId);
    console.log("GET ME USER:", user);

    if (!user) {
      // Edge case (normally nahi hoga)
      user = await User.create({
        _id: userId,
        username: generateUsername(),
      });
    }

    res.json({
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

const OTP_EXPIRY_MIN = 5;

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const response = await fetch("https://ninzasms.in.net/auth/send_sms", {
      method: "POST",
      headers: {
        authorization: process.env.NINZA_SMS_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender_id: "15723",
        variables_values: otp,
        numbers: phone,
      }),
    });

    const data = await response.json();


    // 🔥 UNIVERSAL SUCCESS CHECK
    let parsedResponse = null;

    if (data.response) {
      try {
        parsedResponse = JSON.parse(data.response);
      } catch (e) {}
    }

    const isSuccess =
      data.status === 1 ||
      data.msg?.toLowerCase().includes("otp sent") ||
      parsedResponse?.return === true;

    if (isSuccess) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    }

    // ❌ Only REAL failure reaches here
    return res.status(400).json({
      success: false,
      message: "OTP sending failed",
      raw: data,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await Otp.findOne({ phone, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ phone });

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        username: `User_${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
export const me = async (req, res) => {
  res.json({
    userId: req.user.userId,
    username: req.user.username,
    isAnonymous: req.user.isAnonymous,
  });
};