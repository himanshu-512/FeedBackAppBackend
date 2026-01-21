import AsyncStorage from "@react-native-async-storage/async-storage";
import {ip} from "../services/ip";
import { gateWay } from "./apiURL";

const BASE_URL = gateWay;
console.log("BASE_URL:", BASE_URL);

// 🔐 helper
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/* ================= CHANNELS ================= */

export async function getChannels() {
  const token = await AsyncStorage.getItem("token");

  const url = `${BASE_URL}/channels/all`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

/* ================= MESSAGES ================= */

// export async function getMessages(channelId) {
//   const headers = await getAuthHeaders();

//   const res = await fetch(`${BASE_URL}/messages/messages/${channelId}`, {
//     headers,
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }

//   return res.json();
// }

export async function getMessages(channelId) {
  console.log(channelId);
  const token = await AsyncStorage.getItem("token");
  console.log(token);
  const userId = await AsyncStorage.getItem("userId");

  const res = await fetch(
    `${BASE_URL}/messages/messages/${channelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // optional
        "x-user-id": userId,              // 🔥 REQUIRED
        "Content-Type": "application/json",
      },
    }
  );
  // console.log("GET MESSAGES:", res);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}


/* ================= AUTH ================= */

export async function getAnonymousUser() {
  const res = await fetch(`${BASE_URL}/auth/auth/anonymous`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}

export const searchChannels = async (query, category) => {
  if (!query || query.length < 2) return [];

  const token = await AsyncStorage.getItem("token");
  console.log(token);

  const url = `${BASE_URL}/channels/search?q=${encodeURIComponent(
    query
  )}&category=${encodeURIComponent(category || "All")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
};
