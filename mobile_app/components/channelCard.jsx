import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export function ChannelCard({ item }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/channels/${item.id}`)}
      android_ripple={{ color: "#ddd" }} // optional, no design change
    >
      {/* ⬇️ YOUR ORIGINAL DESIGN (UNCHANGED) */}
      <View style={styles.card}>
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.activeRow}>
            <Text style={styles.userIcon}>👥</Text>
            <Text style={styles.active}>{item.active} active</Text>
          </View>
        </View>

        <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginVertical: 6,
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  userIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  active: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 30,
  },
});
