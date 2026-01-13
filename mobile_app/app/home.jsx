import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChannelCard } from "../components/channelCard";
import { useEffect, useState } from "react";
import { getChannels } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ip from "../services/ip";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const joinChannel = async (channelId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`http://${ip}:3000/channels/${channelId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 IMPORTANT: channels list refresh
      const updatedChannels = await getChannels();
      setChannels(updatedChannels);
    } catch (err) {
      console.log("JOIN ERROR:", err.message);
    }
  };
  useEffect(() => {
    getChannels()
      .then((data) => {
        // console.log("CHANNELS:", data);
        setChannels(data); // ✅ IMPORTANT
      })
      .catch((err) => console.log("CHANNEL ERROR:", err.message));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Feedback Chat</Text>
        <Text style={styles.headerIcon}>💬</Text>
      </LinearGradient>

      {/* TABS */}
      <View style={styles.tabs}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Trending</Text>
          <View style={styles.indicator} />
        </View>
        <Text style={styles.tab}>Official</Text>
        <Text style={styles.tab}>My Channels</Text>
      </View>

      {/* CHANNEL LIST */}
      <FlatList
        data={channels}
        keyExtractor={(item) => item._id} // ✅ FIX
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChannelCard item={item} onJoin={joinChannel} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    margin: 16,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  headerIcon: {
    fontSize: 28,
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
  },

  tab: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginRight: 30,
  },

  activeTab: {
    marginRight: 30,
  },

  activeTabText: {
    fontSize: 20,
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
    paddingBottom: 30,
  },
});
