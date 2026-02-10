import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { verifyOtp } from "../services/auth";
import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";

export default function OTP() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async () => {
    const phone = await AsyncStorage.getItem("otp_phone");

    if (otp.length !== 6) {
      alert("Enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOtp(phone, otp);
      await AsyncStorage.removeItem("otp_phone");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userId", data.userId);
      await AsyncStorage.setItem("username", data.username);

      router.replace("/anonymous");
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TopBlob />
        <StatusBar barStyle="dark-content" />

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.welcome}>Verify OTP 🔐</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to your phone
          </Text>

          {/* OTP INPUT */}
          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter OTP"
            style={styles.otpInput}
            placeholderTextColor="#999"
          />

          {/* BUTTON */}
          <Pressable
            onPress={verifyOTP}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
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

        <BottomBlob />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },

  content: {
    marginTop: 180,
  },

  welcome: {
    fontSize: 32,
    fontFamily: "Poppins-ExtraBold", // 🔥 EXTRA BOLD
    marginBottom: 6,
    color: "#111",
  },

  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 30,
  },

  otpInput: {
    fontSize: 22,
    letterSpacing: 10,
    textAlign: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 30,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
  },

  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
});
