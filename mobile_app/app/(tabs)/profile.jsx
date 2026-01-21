import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import ip from "../../services/ip";

export default function SettingsScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("username").then((u) => {
      if (u) setUsername(u);
    });
  }, []);

  const logout = async () => {
    Alert.alert("Logout", "You will be logged out from this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/login");
        },
      },
    ]);
  };

  const leaveAllChannels = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`http://${ip}:3000/channels/leave-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Done", "You left all joined channels");
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Manage your account</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        style={styles.scrollView}
      >
        {/* 👤 PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>
                {username ? username[0] : "A"}
              </Text>
            )}
          </View>

          <Text style={styles.username}>
            {username || "Anonymous"}
          </Text>
          <Text style={styles.subText}>
            Anonymous identity · No personal data
          </Text>
        </View>

        {/* ⚙️ SETTINGS */}
        <View style={styles.list}>
          <Pressable style={styles.item} onPress={leaveAllChannels}>
            <View style={styles.iconWrap}>
              <Feather name="log-out" size={20} color="#7860E3" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Leave all channels</Text>
              <Text style={styles.itemDesc}>
                Exit every channel you joined
              </Text>
            </View>

            <Feather name="chevron-right" size={20} color="#bbb" />
          </Pressable>

          <Pressable
            style={[styles.item, styles.danger]}
            onPress={logout}
          >
            <View style={[styles.iconWrap, styles.dangerIcon]}>
              <Feather name="power" size={20} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: "#E06B78" }]}>
                Logout
              </Text>
              <Text style={styles.itemDesc}>
                Remove account from this device
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* 🎨 REFINED STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },

  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },

  headerSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },

  scrollView: {
    marginTop: -18,
  },

  scroll: {
    paddingBottom: 30,
  },

  profileCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 24,

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },

  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#f1f1f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#7860E3",
  },

  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#7860E3",
  },

  username: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "800",
  },

  subText: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },

  list: {
    paddingHorizontal: 20,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 16,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  itemDesc: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  danger: {
    backgroundColor: "#fff5f6",
  },

  dangerIcon: {
    backgroundColor: "#E06B78",
  },
});
