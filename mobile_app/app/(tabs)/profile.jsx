import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Animated,
  Easing,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { useTabBarAnimation } from "../../components/TabBarAnimationContext";

/* 🔗 API */
const API_BASE_URL = "http://192.168.0.106:3000";

async function fetchProfile() {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load profile");
  }

  return res.json();
}

/* ✅ SIMPLE LIFT (Material style) */
const lift = {
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
};

/* 🦴 SKELETON BOX */
function SkeletonBox({ style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 320],
  });

  return (
    <View
      style={[
        style,
        {
          backgroundColor: "#e5e7eb",
          overflow: "hidden",
        },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: "40%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.6)",
          transform: [{ translateX }],
        }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pulse = useRef(new Animated.Value(0)).current;
  const { onScroll: onTabScroll } = useTabBarAnimation();

  useEffect(() => {
    AsyncStorage.getItem("theme").then((t) => t && setTheme(t));
    loadProfile();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchProfile();
      setProfile(res);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    await AsyncStorage.setItem("theme", next);
  };

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const colors = theme === "dark" ? dark : light;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient colors={colors.gradient} style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Manage your account</Text>

        <Pressable style={styles.toggle} onPress={toggleTheme}>
          <Text style={{ color: "#fff", fontFamily: "Poppins-Medium" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </Text>
        </Pressable>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onTabScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7860E3"
            colors={["#7860E3"]}
          />
        }
      >
        {loading ? (
          <>
            {/* PROFILE SKELETON */}
            <View style={[styles.card, lift]}>
              <SkeletonBox
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
              <SkeletonBox
                style={{ width: 140, height: 18, borderRadius: 8, marginTop: 16 }}
              />
              <SkeletonBox
                style={{ width: 200, height: 14, borderRadius: 8, marginTop: 8 }}
              />
            </View>

            {/* STATS SKELETON */}
            <View style={styles.stats}>
              {[1, 2, 3, 4].map((_, i) => (
                <SkeletonBox
                  key={i}
                  style={{
                    width: "48%",
                    height: 80,
                    borderRadius: 28,
                    marginBottom: 14,
                  }}
                />
              ))}
            </View>

            {/* ACTION SKELETON */}
            {[1, 2].map((_, i) => (
              <SkeletonBox
                key={i}
                style={{
                  height: 60,
                  borderRadius: 28,
                  marginHorizontal: 20,
                  marginBottom: 14,
                }}
              />
            ))}
          </>
        ) : (
          <>
            {/* PROFILE CARD */}
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card },
                lift,
              ]}
            >
              <Animated.View
                style={[
                  styles.avatar,
                  {
                    borderColor: colors.accent,
                    transform: [{ scale }],
                  },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.accent }]}>
                  {profile.username[0]}
                </Text>
              </Animated.View>

              <Text style={[styles.username, { color: colors.text }]}>
                {profile.username}
              </Text>
              <Text style={[styles.subtext, { color: colors.subtext }]}>
                Anonymous identity · No personal data
              </Text>
            </View>

            {/* STATS */}
            <View style={styles.stats}>
              <Stat label="Messages" value={profile.stats.messages} colors={colors} />
              <Stat label="Helpful Votes" value={profile.stats.helpfulVotes} colors={colors} />
              <Stat label="Points" value={profile.wallet.points} colors={colors} />

              <View
                style={[
                  styles.badgeBox,
                  { backgroundColor: colors.badgeBg },
                  lift,
                ]}
              >
                <Text style={{ color: colors.badgeText, fontWeight: "900", fontFamily: "Poppins-Bold" }}>
                  {profile.wallet.badge.icon} {profile.wallet.badge.name}
                </Text>
              </View>
            </View>

            {/* ACTIONS */}
            <Action
              title="Leave all channels"
              desc="Exit every channel you joined"
              icon="⇦"
              colors={colors}
            />
            <Action
              title="Logout"
              desc="Remove account from this device"
              icon="⏻"
              danger
              colors={colors}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* COMPONENTS */

function Stat({ label, value, colors }) {
  return (
    <View style={[styles.stat, { backgroundColor: colors.card }, lift]}>
      <Text style={[styles.statValue, { color: colors.accent }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.subtext }]}>
        {label}
      </Text>
    </View>
  );
}

function Action({ title, desc, icon, danger, colors }) {
  return (
    <View
      style={[
        styles.item,
        { backgroundColor: danger ? colors.dangerBg : colors.card },
        lift,
      ]}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: danger ? colors.danger : colors.iconBg },
        ]}
      >
        <Text style={{ color: danger ? "#fff" : colors.accent }}>
          {icon}
        </Text>
      </View>

      <View>
        <Text
          style={[
            styles.itemTitle,
            { color: danger ? colors.danger : colors.text },
          ]}
        >
          {title}
        </Text>
        <Text style={styles.itemDesc}>{desc}</Text>
      </View>
    </View>
  );
}

/* THEMES */

const light = {
  bg: "#f9f9fb",
  card: "#fff",
  text: "#111",
  subtext: "#777",
  accent: "#7860E3",
  gradient: ["#7860E3", "#D66767"],
  iconBg: "#f1f0ff",
  danger: "#E06B78",
  dangerBg: "#fff5f6",
  badgeBg: "#e8e6ff",
  badgeText: "#4338ca",
};

const dark = {
  bg: "#0f0f14",
  card: "#1a1a22",
  text: "#f4f4f5",
  subtext: "#a1a1aa",
  accent: "#7860E3",
  gradient: ["#7860E3", "#D66767"],
  iconBg: "#2a2a35",
  danger: "#E06B78",
  dangerBg: "#2a1a1d",
  badgeBg: "#2f2b66",
  badgeText: "#c7c4ff",
};

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 56,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Poppins-ExtraBold",
  },

  headerSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },

  toggle: {
    position: "absolute",
    top: 56,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    padding: 8,
  },

  card: {
    margin: 20,
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 38,
    fontFamily: "Poppins-ExtraBold",
  },

  username: {
    marginTop: 14,
    fontSize: 22,
    fontFamily: "Poppins-Bold",
  },

  subtext: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: "Poppins-Regular",
  },

  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  stat: {
    width: "48%",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: "center",
  },

  statValue: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
  },

  statLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },

  badgeBox: {
    width: "100%",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    marginHorizontal: 20,
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  itemDesc: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#777",
  },
});
