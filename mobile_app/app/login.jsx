import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithPhoneNumber } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

import { auth, firebaseConfig } from "../services/firebase"; // 🔥 update export
import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 REQUIRED FOR EXPO
  const recaptchaVerifier = useRef(null);

  const sendOTP = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10 digit number");
      return;
    }

    try {
      setLoading(true);

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        recaptchaVerifier.current // ✅ IMPORTANT
      );

      router.push({
        pathname: "/otp",
        params: {
          phone,
          verificationId: confirmation.verificationId,
        },
      });
    } catch (error) {
      console.log("FIREBASE OTP ERROR:", error);
      alert(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 INVISIBLE RECAPTCHA (NO UI CHANGE) */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <TopBlob />
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Login with Phone</Text>
      <Text style={styles.subtitle}>We will send you a verification code</Text>

      <View style={styles.inputWrap}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Enter phone number"
          style={styles.input}
        />
      </View>

      <Pressable onPress={sendOTP} disabled={loading}>
        <LinearGradient
          colors={["#7860E3", "#D66767"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.btnText}>
            {loading ? "Sending..." : "Send OTP"}
          </Text>
        </LinearGradient>
      </Pressable>

      <BottomBlob />
    </View>
  );
}


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
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 30,
  },
  prefix: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 14,
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
