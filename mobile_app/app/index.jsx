import { View, Text, Image, StatusBar, StyleSheet, Dimensions } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      await new Promise((res) => setTimeout(res, 2000));

      try {
        const token = await AsyncStorage.getItem("token");
        if (token) router.replace("/(tabs)/home");
        else router.replace("/onboarding");
      } catch (err) {
        router.replace("/onboarding");
      }
    };

    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Logo Container */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* App Name */}
      <View style={styles.textRow}>
        <Text style={[styles.title, styles.purple]}>FEEDBACK </Text>
        <Text style={[styles.title, styles.pink]}>CHAT</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Smart feedback. Better conversations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  purple: {
    color: "#6d28d9",
  },
  pink: {
    color: "#db2777",
  },
  tagline: {
    fontSize: 14,
    color: "#6b7280",
    letterSpacing: 0.5,
  },
});
