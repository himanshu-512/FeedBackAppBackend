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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ip } from "../../mobile_app/services/ip";
import TopBlob from "../components/TopBlob";
import BottomBlob from "../components/BottomBlob";
import { anonymousLogin } from "../services/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");
const avatar = require("../assets/images/logo.png");

export default function Anonymous() {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem("token");
console.log(token);
console.log("PROFILE URL:", `http://${ip}:3000/auth/me`);

        const res = await fetch(`http://10.192.36.156:3000/auth/me`, {
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
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = async () => {
      try {
        const data = await anonymousLogin();
        setUsername(data.username);
      } catch (err) {
        console.error("Anonymous login error:", err);
      } finally {
        setLoading(false);
      }
    };

    // login();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Background blobs */}
      <TopBlob />
      <BottomBlob />

      {/* Content */}
      <View style={styles.content}>
        {/* Gradient ellipse avatar */}
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

        {/* Username pill */}
        <View style={styles.usernameBox}>
          <Text style={styles.usernameText}>
            {loading ? "Generating..." : username}
          </Text>
        </View>

        <Text style={styles.info}>No profile • No identity • No tracking</Text>
      </View>

      {/* Continue button */}
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
    fontWeight: "800",
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
