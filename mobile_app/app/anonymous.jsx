import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";
import { gateWay } from "../services/apiURL";

const BASE_URL = gateWay;
const { height } = Dimensions.get("window");
const avatar = require("../assets/images/hacker.png");

export default function Anonymous() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  /* 🔐 FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setUsername(data.username);
        setUserId(data.userId);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />

      {/* BACKGROUND BLOBS */}
      <TopBlob />
      <BottomBlob />

      {/* CONTENT */}
      <View style={styles.content}>
        {/* AVATAR */}
        <LinearGradient
          colors={["#7860E3", "#D66767"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarEllipse}
        >
          <Image source={avatar} style={styles.avatarImage} />
        </LinearGradient>

        {/* TITLE */}
        <Text style={styles.title}>
          <Text style={styles.purple}>You are </Text>
          <Text style={styles.pink}>anonymous</Text>
        </Text>

        {/* USERNAME */}
        <Animated.View
          style={[
            styles.usernameBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.usernameText}>
            {loading ? "Generating..." : username}
          </Text>
        </Animated.View>

        {!loading && (
          <Pressable onPress={() => alert("Username change coming soon!")}>
            <Text style={styles.change}>Change username</Text>
          </Pressable>
        )}

        {/* TRUST TEXT */}
        <Text style={styles.info}>
          No profile • No identity • No tracking
        </Text>
        <Text style={styles.trust}>
          We don’t store personal data.
        </Text>
      </View>

      {/* CONTINUE BUTTON */}
      <Pressable
        disabled={loading}
        onPress={() => router.replace("/home")}
        style={styles.btnWrap}
      >
        <LinearGradient
          colors={["#7b6cff", "#e46b6b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, loading && { opacity: 0.6 }]}
        >
          <Text style={styles.btnText}>Start Chatting</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    alignItems: "center",
    marginTop: height * 0.18,
    paddingHorizontal: 24,
  },

  avatarEllipse: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  avatarImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  title: {
    fontSize: 30,
    fontFamily: "Poppins-ExtraBold", // 🔥 EXTRA BOLD
    marginBottom: 14,
  },

  purple: {
    color: "#7b6cff",
  },

  pink: {
    color: "#e46b6b",
  },

  usernameBox: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",

    shadowColor: "#7860E3",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  usernameText: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#000",
    letterSpacing: 0.5,
  },

  change: {
    color: "#7860E3",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },

  info: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#444",
    marginTop: 6,
    textAlign: "center",
  },

  trust: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },

  btnWrap: {
    position: "absolute",
    bottom: height * 0.18,
    left: 24,
    right: 24,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },

  btnText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },
});
