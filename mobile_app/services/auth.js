// services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import ip  from "./ip";

const BASE_URL = `http://${ip}:3000`; 

export async function anonymousLogin() {
  const res = await fetch(`${BASE_URL}/auth/auth/anonymous`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Anonymous login failed");
  }

  const data = await res.json();

  // Save for future use (API + Socket)
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("userId", data.userId);
  await AsyncStorage.setItem("username", data.username);

  return data;
}
