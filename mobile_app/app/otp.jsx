import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "../services/firebase";
import ip from "../services/ip";

export default function OTP() {
  const router = useRouter();
  const { phone, verificationId } = useLocalSearchParams(); // ✅ FIXED

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      alert("Enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      console.log("OTP:", otp);

      // 🔥 1️⃣ FIREBASE OTP VERIFY
      const credential = PhoneAuthProvider.credential(
        verificationId,
        otp
      );

      const result = await signInWithCredential(auth, credential);
      const firebasePhone = result.user.phoneNumber;

      // 🔐 2️⃣ BACKEND → JWT
      const res = await fetch(`http://${ip}:3000/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: firebasePhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // 🔐 SAVE USER DATA
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("username", data.username);

      // ✅ LOGIN SUCCESS
      router.replace("/anonymous");
    } catch (err) {
      console.log("OTP VERIFY ERROR:", err);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        OTP sent to +91 {phone}
      </Text>

      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter OTP"
        style={styles.otpInput}
      />

      <Pressable onPress={verifyOTP} disabled={loading}>
        <LinearGradient
          colors={["#7860E3", "#D66767"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.btnText}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}


/* 🎨 STYLES — UNCHANGED */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  otpInput: {
    fontSize: 22,
    letterSpacing: 12,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
