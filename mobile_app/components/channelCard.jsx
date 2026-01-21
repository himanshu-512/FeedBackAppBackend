import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export function ChannelCard({ item, isJoined, onJoin }) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 14 }}>
      <Pressable
        disabled={!isJoined}
        onPress={() =>
          router.push({
            pathname: `/channels/${item._id}`,
            params: { name: item.name },
          })
        }
        android_ripple={isJoined ? { color: "#ccc" } : null}
        style={styles.card}
      >
        {/* LEFT CONTENT */}
        <View style={styles.left}>
          <Text style={styles.title}>{item.name}</Text>

          {item.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <Text style={styles.members}>
            👥 {item.members.length} members
          </Text>

          {!isJoined ? (
            <Pressable
              onPress={() => onJoin(item._id)}
              style={styles.joinBtn}
            >
              <Text style={styles.joinText}>Join</Text>
            </Pressable>
          ) : (
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedText}>Joined</Text>
            </View>
          )}
        </View>

        {/* ICON */}
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: item.color || "#dcd6ff" },
          ]}
        >
          <Text style={styles.icon}>
            {item.icon || "💬"}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#e5e5e59c",   // 👈 as you wanted
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  left: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  desc: {
    fontSize: 14,
    color: "#444",
    marginVertical: 6,
  },

  members: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },

  joinBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#7860E3",
  },

  joinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  joinedBadge: {
    marginTop: 10,
    backgroundColor: "#d4f3e3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  joinedText: {
    fontSize: 12,
    color: "#1f9d55",
    fontWeight: "700",
  },

  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 26,
  },
});
