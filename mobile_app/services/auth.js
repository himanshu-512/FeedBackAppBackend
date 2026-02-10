import AsyncStorage from "@react-native-async-storage/async-storage";
import {ip} from "../services/ip";
import { gateWay } from "./apiURL";

const BASE_URL = gateWay;

/* 🔑 ANONYMOUS LOGIN */
export async function anonymousLogin() {
  const res = await fetch(`${BASE_URL}/auth/anonymous`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Anonymous login failed");
  }

  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("userId", data.userId);
  await AsyncStorage.setItem("username", data.username);

  return data;
}

/* 📲 SEND OTP */
export const sendOtp = async (phone) => {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  console.log(`${BASE_URL}/auth/send-otp`);
  await AsyncStorage.setItem("otp_phone", phone);

  const data = await res.json(); // ✅ FIX

  console.log("SEND OTP RESPONSE:", data);

  if (!data.success) {
    throw new Error(data.message || "OTP failed");
  }

  return data; // { success: true }
};

/* 🔐 VERIFY OTP */
export const verifyOtp = async (phone,otp) => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Invalid OTP");
  }

  // ✅ SAVE LOGIN DATA
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("userId", data.userId);
  await AsyncStorage.setItem("username", data.username);

  return data;
};
