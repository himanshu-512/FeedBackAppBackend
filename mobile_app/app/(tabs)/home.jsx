import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChannelCard } from "../../components/channelCard";
import { useEffect, useState, useCallback } from "react";
import { getChannels } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { gateWay } from "../../services/apiURL";

/* 🔓 SIMPLE JWT PAYLOAD DECODE */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Trending");

  /* 🔑 LOAD USER */
  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const decoded = decodeJWT(token);
      if (decoded?.userId) {
        setUserId(decoded.userId);
        setUsername(decoded.username);
      }
    };
    loadUser();
  }, []);

  /* 📡 LOAD CHANNELS */
  const loadChannels = useCallback(() => {
    setLoading(true);
    getChannels()
      .then((data) => {
        setChannels(data);
        setFiltered(data);
      })
      .catch((err) =>
        console.log("CHANNEL ERROR:", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadChannels();
  }, []);

  /* 🧭 FILTER BASED ON TAB */
  useEffect(() => {
    if (!userId) return;

    if (activeTab === "Trending") {
      setFiltered(channels);
    } else if (activeTab === "My Channels") {
      setFiltered(
        channels.filter((ch) =>
          ch.members?.some((m) => m.userId === userId)
        )
      );
    } else if (activeTab === "Official") {
      setFiltered(
        channels.filter((ch) => ch.isOfficial)
      );
    }
  }, [activeTab, channels, userId]);

  /* ➕ JOIN CHANNEL */
  const joinChannel = async (channelId) => {
    try {
      await fetch(`${gateWay}/channels/${channelId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });

      setChannels((prev) =>
        prev.map((ch) =>
          ch._id === channelId
            ? {
                ...ch,
                members: ch.members.some(
                  (m) => m.userId === userId
                )
                  ? ch.members
                  : [...ch.members, { userId, username }],
              }
            : ch
        )
      );
    } catch (err) {
      console.log("JOIN ERROR:", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerText}>Feedback Chat</Text>
          <Text style={styles.headerSub}>
            Join trending conversations
          </Text>
        </View>
        <Text style={styles.headerIcon}>💬</Text>
      </LinearGradient>

      {/* 🧭 TABS */}
      <View style={styles.tabs}>
        {["Trending", "Official", "My Channels"].map(
          (tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabWrap}
            >
              <Text
                style={
                  tab === activeTab
                    ? styles.activeTabText
                    : styles.tab
                }
              >
                {tab}
              </Text>
              {tab === activeTab && (
                <View style={styles.indicator} />
              )}
            </Pressable>
          )
        )}
      </View>

      {/* 📃 CHANNEL LIST */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7860E3"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadChannels}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>📭</Text>
              <Text style={styles.emptyText}>
                No channels found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ChannelCard
              item={item}
              onJoin={joinChannel}
              isJoined={item.members?.some(
                (m) => m.userId === userId
              )}
            />
          )}
        />
      )}

      {/* ➕ FLOATING ACTION BUTTON */}
      {/* <Pressable style={styles.fab}>
        <Feather name="plus" size={24} color="#fff" />
      </Pressable> */}
    </SafeAreaView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },

  header: {
    margin: 16,
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  headerSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 14,
  },

  headerIcon: {
    fontSize: 30,
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },

  tabWrap: {
    marginRight: 30,
  },

  tab: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  activeTabText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#E06B78",
  },

  indicator: {
    height: 4,
    width: 40,
    borderRadius: 4,
    backgroundColor: "#7860E3",
    marginTop: 4,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    marginTop: 8,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#7860E3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#7860E3",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});
