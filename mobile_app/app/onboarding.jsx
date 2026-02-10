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
import { useRouter } from "expo-router";

import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";

const { height } = Dimensions.get("window");
const logo = require("../assets/images/logo.png");

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />

      {/* TOP BLOB */}
      <TopBlob />

      {/* CONTENT */}
      <View style={styles.content}>
        {/* LOGO */}
        <LinearGradient
          colors={["#7860E3", "#D66767"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoEllipse}
        >
          <Image source={logo} style={styles.logoImage} />
        </LinearGradient>

        {/* TITLE */}
        <Text style={styles.title}>
          <Text style={styles.purple}>FEEDBACK </Text>
          <Text style={styles.pink}>CHAT</Text>
        </Text>

        {/* SUBTITLES */}
        <Text style={styles.subtitle}>
          Share honest feedback.
        </Text>
        <Text style={[styles.subtitle, { marginTop: 4 }]}>
          Stay anonymous.
        </Text>

        {/* TAGLINE */}
        <Text style={styles.tagline}>
          Real conversations without fear.
        </Text>
      </View>

      {/* BUTTON */}
      <Pressable
        onPress={() => router.push("/login")}
        style={styles.btnWrap}
      >
        <LinearGradient
          colors={["#7b6cff", "#e46b6b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </LinearGradient>
      </Pressable>

      {/* BOTTOM BLOB */}
      <BottomBlob />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    alignItems: "center",
    marginTop: height * 0.18,
  },

  logoEllipse: {
    width: 110,
    height: 110,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 26,

    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  logoImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  title: {
    fontSize: 34,
    fontFamily: "Poppins-Bold",
    marginBottom: 14,
  },

  purple: {
    color: "#7b6cff",
    fontFamily: "Poppins-Bold",
  },

  pink: {
    color: "#e46b6b",
    fontFamily: "Poppins-Bold",
  },

  subtitle: {
    fontSize: 17,
    fontFamily: "Poppins-Medium",
    color: "#444",
  },

  tagline: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#777",
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

    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  btnText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },
});
