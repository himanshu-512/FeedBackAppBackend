import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from '../utils/username.js';
// import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { sendOtpSms } from "../utils/sendOtpSms.js";
// import { generateUsername } from "../utils/username.js";

// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined');
// }

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