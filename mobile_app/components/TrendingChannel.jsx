import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function TrendingChannel({ onJoin }) {
  return (
    <LinearGradient
      colors={["#7b5cff", "#ff6b6b"]}
      style={styles.card}
    >
      <Text style={styles.title}>Gaming Zone</Text>
      <Text style={styles.trending}>🔥 Trending now</Text>

      <View style={styles.row}>
        <Text style={styles.members}>23.5K Members</Text>

        <Pressable style={styles.joinBtn} onPress={onJoin}>
          <Text style={styles.joinText}>Join</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  trending: {
    color: "#eaff00",
    marginTop: 4,
    fontWeight: "700",
  },

  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  members: {
    color: "#fff",
    fontWeight: "700",
  },

  joinBtn: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  joinText: {
    color: "#fff",
    fontWeight: "800",
  },
});
