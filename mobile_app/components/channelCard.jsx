import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export function ChannelCard({ item, isJoined, onJoin }) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Pressable
        disabled={!isJoined}
        onPress={() =>
          router.push({
            pathname: `/channels/${item._id}`,
            params: { name: item.name },
          })
        }
        android_ripple={isJoined ? { color: "#e5e7eb" } : null}
        style={styles.card}
      >
        {/* LEFT CONTENT */}
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.name}</Text>
          </View>

          {item.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.members}>👥 {item.members.length}</Text>

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
        </View>

        {/* FLOATING ICON */}
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: item.color || "#EDEBFF" },
          ]}
        >
          <Text style={styles.icon}>{item.icon || "💬"}</Text>
        </View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",

    // ✅ REAL floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,

    // subtle border so card doesn’t vanish
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  left: {
    flex: 1,
    paddingRight: 14,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 17,
    fontFamily: "PoppinsExtraBold",
    color: "#111827",
  },

  desc: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#4B5563",
    marginTop: 6,
    lineHeight: 22,
  },

  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  members: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
  },

  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#6C5CE7",
  },

  joinText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 13,
  },

  joinedBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
  },

  joinedText: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
    color: "#166534",
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",

    // icon also floats slightly
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  icon: {
    fontSize: 24,
  },
});

