import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  // Logo animation
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Text animation
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    // LOGO ENTRY
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // TEXT APPEAR
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();

      // BREATHING EFFECT
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.04,
            duration: 2600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // NAVIGATION
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        router.replace(token ? "/(tabs)/home" : "/onboarding");
      } catch {
        router.replace("/onboarding");
      }
    }, 3400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* LOGO */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/logogif.gif")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* BRAND TEXT */}
      <Animated.View
        style={[
          styles.textWrapper,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        <Text style={styles.title}>AnChat</Text>
        <Text style={styles.tagline}>
          Smart feedback. Better conversations.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  logoWrapper: {
    marginBottom: 14, // ⬅️ reduced gap (important)
  },

  logo: {
    width: 240, // ⬅️ slightly bigger = more impact
    height: 240,
  },

  textWrapper: {
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    fontWeight: "800",
    letterSpacing: 0.8, // ⬅️ cleaner than 1.2
    color: "#5B21B6",   // ⬅️ deeper purple = premium
  },

  tagline: {
    marginTop: 6,
    fontSize: 13.5,
    color: "#6b7280",
    letterSpacing: 0.3,
  },
});
