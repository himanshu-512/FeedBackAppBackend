import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChannelCard } from "../../components/channelCard";
import { useEffect, useState, useCallback, useRef } from "react";
import { getChannels } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { gateWay } from "../../services/apiURL";
import { useRouter } from "expo-router";
import Reanimated from "react-native-reanimated";
import { useTabBarAnimation } from "../../components/TabBarAnimationContext";

/* ANDROID LAYOUT ANIMATION */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* JWT DECODE */
const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const categories = ["All", "Tech", "Startup", "College", "Gaming"];

/* ================= SKELETON HELPERS ================= */

function SkeletonBox({ style, opacity }) {
  return (
    <Animated.View
      style={[styles.skeleton, style, { opacity }]}
    />
  );
}

function ChannelSkeleton({ opacity }) {
  return (
    <View style={styles.skeletonCard}>
      <View style={{ flex: 1 }}>
        <SkeletonBox opacity={opacity} style={{ height: 18, width: "60%", marginBottom: 8 }} />
        <SkeletonBox opacity={opacity} style={{ height: 14, width: "90%", marginBottom: 6 }} />
        <SkeletonBox opacity={opacity} style={{ height: 14, width: "70%", marginBottom: 12 }} />
        <SkeletonBox opacity={opacity} style={{ height: 12, width: "40%" }} />
      </View>

      <SkeletonBox
        opacity={opacity}
        style={{ width: 56, height: 56, borderRadius: 28, marginLeft: 12 }}
      />
    </View>
  );
}

/* ================= HOME ================= */

export default function Home() {
  const router = useRouter();
  const { onScroll } = useTabBarAnimation();

  const [channels, setChannels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [topTrending, setTopTrending] = useState(null);
  const [restTrending, setRestTrending] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Trending");
  const [joining, setJoining] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  /* Skeleton pulse */
  const pulse = useRef(new Animated.Value(0.4)).current;

  /* MOST ACTIVE breathing animation */
  const activePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(activePulse, {
          toValue: 1.03,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(activePulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* LOAD USER */
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) return;
      const decoded = decodeJWT(token);
      if (decoded?.userId) {
        setUserId(decoded.userId);
        setUsername(decoded.username);
      }
    });
  }, []);

  /* LOAD CHANNELS */
  const loadChannels = useCallback(() => {
    setLoading(true);
    getChannels()
      .then((data) => {
        setChannels(data);
        const sorted = [...data].sort(
          (a, b) => (b.members?.length || 0) - (a.members?.length || 0)
        );
        setTopTrending(sorted[0] || null);
        setRestTrending(sorted.slice(1));
        setFiltered(sorted.slice(1));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadChannels();
  }, []);

  /* TAB CHANGE */
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (activeTab === "Trending") setFiltered(restTrending);
    if (activeTab === "Official")
      setFiltered(channels.filter((c) => c.isOfficial));
    if (activeTab === "My Channels")
      setFiltered(
        channels.filter((c) =>
          c.members?.some((m) => m.userId === userId)
        )
      );
  }, [activeTab, channels, restTrending, userId]);

  /* JOIN CHANNEL */
  const joinChannel = async (channelId) => {
    if (joining) return;
    setJoining(true);
    try {
      await fetch(`${gateWay}/channels/${channelId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      loadChannels();
    } finally {
      setJoining(false);
    }
  };

  const isJoinedTrending = topTrending?.members?.some(
    (m) => m.userId === userId
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#6C5CE7", "#FF7675"]} style={styles.header}>
        <View>
          <Text style={styles.headerText}>Hi, {username || "User"} 👋</Text>
          <Text style={styles.headerSub}>Talk freely. Stay anonymous.</Text>
        </View>
        <Text style={styles.headerIcon}>💬</Text>
      </LinearGradient>

      {/* SEARCH + CHIPS */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#777" />
          <TextInput placeholder="Search channels..." style={styles.searchInput} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((c) => {
            const active = c === activeCategory;
            return (
              <Pressable
                key={c}
                onPress={() => setActiveCategory(c)}
                style={[styles.chip, active && styles.activeChip]}
              >
                <Text style={[styles.chipText, active && styles.activeChipText]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {["Trending", "Official", "My Channels"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabWrap}
          >
            <Text style={tab === activeTab ? styles.activeTab : styles.tab}>
              {tab}
            </Text>
            {tab === activeTab && <View style={styles.indicator} />}
          </Pressable>
        ))}
      </View>

      {/* LIST / SKELETON */}
      {loading ? (
        <ScrollView contentContainerStyle={styles.list}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ChannelSkeleton key={i} opacity={pulse} />
          ))}
        </ScrollView>
      ) : (
        <Reanimated.FlatList
          data={filtered}
          keyExtractor={(i) => i._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={
            activeTab === "Trending" &&
            topTrending && (
              <Animated.View
                style={[
                  styles.trendingWrapper,
                  { transform: [{ scale: activePulse }] },
                ]}
              >
                <LinearGradient
                  colors={["#FF9F43", "#FF7675"]}
                  style={styles.trendingCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                    <View style={styles.liveDot} />
                    <Text style={styles.badge}>MOST ACTIVE</Text>
                  </View>

                  <Text style={styles.trendingTitle}>{topTrending.name}</Text>
                  <Text style={styles.trendingNow}>
                    🔥 {topTrending.members?.length || 0} members chatting
                  </Text>

                  <Pressable
                    style={[
                      styles.joinBtn,
                      isJoinedTrending && { backgroundColor: "#22C55E" },
                    ]}
                    onPress={() => {
                      if (isJoinedTrending) {
                        router.push({
                          pathname: `/channels/${topTrending._id}`,
                          params: { name: topTrending.name },
                        });
                      } else {
                        joinChannel(topTrending._id);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.joinText,
                        isJoinedTrending && { color: "#fff" },
                      ]}
                    >
                      {isJoinedTrending
                        ? "Start Chatting"
                        : joining
                        ? "Joining..."
                        : "Join"}
                    </Text>
                  </Pressable>
                </LinearGradient>
              </Animated.View>
            )
          }
          renderItem={({ item }) => (
            <ChannelCard
              item={item}
              onJoin={joinChannel}
              isJoined={item.members?.some((m) => m.userId === userId)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },

  /* ================= HEADER ================= */

  header: {
    margin: 16,
    borderRadius: 26,
    padding: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
  },

  headerText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsExtraBold",
  },

  headerSub: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    fontFamily: "PoppinsRegular",
    fontSize: 13,
  },

  headerIcon: {
    fontSize: 28,
  },

  /* ================= SEARCH ================= */

  searchWrap: {
    paddingHorizontal: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 4,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#111",
  },

  /* ================= CHIPS ================= */

  chip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#6C5CE7",
  },

  chipText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#6B7280",
  },

  activeChipText: {
    color: "#fff",
  },

  /* ================= TABS ================= */

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
  },

  tabWrap: {
    marginRight: 30,
  },

  tab: {
    fontSize: 15,
    fontFamily: "PoppinsMedium",
    color: "#9CA3AF",
  },

  activeTab: {
    fontSize: 15,
    fontFamily: "PoppinsBold",
    color: "#6C5CE7",
  },

  indicator: {
    height: 4,
    width: 36,
    backgroundColor: "#6C5CE7",
    marginTop: 6,
    borderRadius: 4,
  },

  /* ================= LIST ================= */

  list: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },

  /* ================= TRENDING CARD ================= */

  trendingWrapper: {
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  trendingCard: {
    borderRadius: 28,
    padding: 17,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  badge: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "PoppinsBold",
    letterSpacing: 0.6,
  },

  trendingTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsExtraBold",
    marginTop: 6,
  },

  trendingNow: {
    color: "#FFE4E6",
    marginVertical: 10,
    fontFamily: "PoppinsMedium",
    fontSize: 13,
  },

  joinBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    elevation: 4,
  },

  joinText: {
    color: "#6C5CE7",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },

  /* ================= SKELETON ================= */

  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
  },

  skeletonCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },
});
