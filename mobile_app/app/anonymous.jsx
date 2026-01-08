import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";

const { height } = Dimensions.get("window");
const avatar = require("../assets/images/logo.png");

export default function Anonymous() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setUsername("User_4566");
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Background blobs */}
      <TopBlob />
      <BottomBlob />

      {/* Content */}
      <View style={styles.content}>
        {/* 🔥 GRADIENT ELLIPSE AVATAR */}
        <LinearGradient
          colors={["#7860E3", "#D66767"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarEllipse}
        >
          <Image source={avatar} style={styles.avatarImage} />
        </LinearGradient>

        <Text style={styles.title}>
          <Text style={styles.purple}>You are </Text>
          <Text style={styles.pink}>anonymous</Text>
        </Text>

        {/* ✅ IMPORTANT USERNAME BOX */}
        <View style={styles.usernameBox}>
          <Text style={styles.usernameText}>
            {username || "Loading..."}
          </Text>
        </View>

        <Text style={styles.info}>
          No profile • No identity • No tracking
        </Text>
      </View>

      {/* Continue button */}
      <Pressable
        onPress={() => router.replace("/home")}
        style={styles.btnWrap}
      >
        <LinearGradient
          colors={["#7b6cff", "#e46b6b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.btnText}>Continue</Text>
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
    marginTop: height * 0.22,
    paddingHorizontal: 24,
  },

  /* 🔥 Gradient ellipse (same as onboarding) */
  avatarEllipse: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,

    elevation: 10, // Android shadow
    shadowColor: "#000", // iOS shadow
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
    fontWeight: "800",
    marginBottom: 14,
  },

  purple: {
    color: "#7b6cff",
  },

  pink: {
    color: "#e46b6b",
  },

  /* ✅ IMPORTANT USERNAME PILL */
  usernameBox: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,

    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  usernameText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 0.5,
  },

  info: {
    fontSize: 16,
    color: "#444",
    marginTop: 6,
    textAlign: "center",
  },

  btnWrap: {
    position: "absolute",
    bottom: height * 0.22,
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
    fontWeight: "800",
  },
});
