import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { searchChannels } from "../../services/api";

/* 🔹 TEMP DATA */
const TRENDING = [
  { _id: "1", name: "Tech Talk", icon: "💻" },
  { _id: "2", name: "Startup Ideas", icon: "🚀" },
  { _id: "3", name: "Gaming Zone", icon: "🎮" },
];

const CATEGORIES = ["All", "Tech", "Startup", "College", "Gaming", "Fitness"];

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔹 Animation */
  const searchAnim = useState(new Animated.Value(0))[0];

  /* 🔍 BACKEND SEARCH */
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchChannels(query, category);
        setResults(data);
      } catch (err) {
        console.log("SEARCH ERROR:", err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, category]);

  /* ⌨️ Keyboard Animation */
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* 💬 CARD */
  const renderCard = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/channels/${item._id}?name=${item.name}`)}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{item.icon || "💬"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>
          {item.members?.length || 0} members
        </Text>
      </View>

      <Feather name="chevron-right" size={20} color="#aaa" />
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Search Channels</Text>
        <Text style={styles.headerSub}>
          Find conversations you care about
        </Text>
      </LinearGradient>

      {/* 🔍 SEARCH BAR WITH ANIMATION */}
      <Animated.View
        style={[
          styles.searchWrap,
          {
            transform: [
              {
                translateY: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
              {
                scale: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.03],
                }),
              },
            ],
            shadowOpacity: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.15],
            }),
          },
        ]}
      >
        <Feather name="search" size={20} color="#777" />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search channels..."
          placeholderTextColor="#888"
          style={styles.input}
        />

        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Feather name="x" size={18} color="#888" />
          </Pressable>
        )}
      </Animated.View>

      {/* 🏷️ CATEGORY CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[
              styles.chip,
              category === cat && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                category === cat && styles.chipTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 🔄 LOADER */}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#7860E3"
          style={{ marginTop: 12 }}
        />
      )}

      {/* 🔥 TRENDING */}
      {query.length === 0 && !loading && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Channels</Text>

          {TRENDING.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>Trending now</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 📋 RESULTS */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading &&
          query.length > 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={styles.emptyText}>
                No channels found
              </Text>
              <Text style={styles.emptySub}>
                Try searching something else
              </Text>
            </View>
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },

  header: {
    paddingTop: 56,
    paddingBottom: 26,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },

  headerSub: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    fontSize: 15,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    paddingHorizontal: 14,
    borderRadius: 18,
    height: 52,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },

  chips: {
    paddingHorizontal: 16,
    marginTop: 14,
  },

  chip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },

  chipActive: {
    backgroundColor: "#7860E3",
    shadowColor: "#7860E3",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  chipText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#333",
  },

  chipTextActive: {
    color: "#fff",
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eae6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 22,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
  },

  desc: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    marginTop: 6,
  },

  emptySub: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },
});
