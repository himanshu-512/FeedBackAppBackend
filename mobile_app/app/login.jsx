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
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";
import { sendOtp } from "../services/auth";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10 digit number");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(phone);
      router.push("/otp");
    } catch {
      alert("OTP send failed");
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
        {/* RECAPTCHA */}

        <TopBlob />
        <StatusBar barStyle="dark-content" />

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.subtitle}>
            Login with your phone number
          </Text>

          {/* INPUT */}
          <View style={styles.inputWrap}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="Enter phone number"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* BUTTON */}
          <Pressable
            onPress={sendOTP}
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
                {loading ? "Sending..." : "Send OTP"}
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
    fontWeight: "900",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 30,
  },

  prefix: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 6,
    color: "#333",
  },

  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 14,
    color: "#000",
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
    fontWeight: "800",
  },
});
