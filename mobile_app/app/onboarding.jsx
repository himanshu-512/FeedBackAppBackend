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

      {/* ✅ REAL TOP SVG BLOB */}
      <TopBlob />

    {/* CONTENT */}
<View style={styles.content}>
  {/* 🔥 GRADIENT ELLIPSE LOGO */}
  <LinearGradient
    colors={["#7860E3", "#D66767"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.logoEllipse}
  >
    <Image source={logo} style={styles.logoImage} />
  </LinearGradient>

  <Text style={styles.title}>
    <Text style={styles.purple}>FEEDBACK </Text>
    <Text style={styles.pink}>CHAT</Text>
  </Text>

  <Text style={styles.subtitle}>Share honest feedback.</Text>
  <Text style={styles.subtitle}>Stay anonymous.</Text>
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

      {/* ✅ REAL BOTTOM SVG BLOB */}
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
    marginTop: height * 0.22,
  },

logoEllipse: {
  width: 110,
  height: 110,
  borderRadius: 65, // 👈 ellipse / circle
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 24,

  // Shadow for premium feel
  elevation: 10, // Android
  shadowColor: "#000", // iOS
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
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },

  purple: {
    color: "#7b6cff",
  },

  pink: {
    color: "#e46b6b",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});
