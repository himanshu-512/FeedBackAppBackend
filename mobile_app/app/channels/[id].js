import { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  PanResponder,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { getMessages } from "../../services/api";
import { gateWay } from "../../services/apiURL";

const BASE_URL = gateWay;

/* =====================
   HELPERS
===================== */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    return JSON.parse(atob(base64Url));
  } catch {
    return null;
  }
};

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

/* =====================
   FEEDBACK CARD
===================== */
const FeedbackCard = ({ item, myId, socketRef, setReplyTo }) => {
  const isMe = item.userId === myId;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx > 60) {
          setReplyTo(item);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
    })
  ).current;

  const like = () => {
    socketRef.current.emit("upvoteMessage", {
      messageId: item._id,
      userId: myId,
    });

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        isMe ? styles.myCard : styles.otherCard,
        { transform: [{ scale }] },
      ]}
    >
      {!isMe && <Text style={styles.username}>{item.username}</Text>}

      <Text style={styles.message}>{item.text}</Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.actions}>
          <Pressable onPress={like} style={styles.actionBtn}>
            <Text style={styles.actionText}>
              👍 {item.upvotes?.length || 0}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setReplyTo(item)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>💬 Reply</Text>
          </Pressable>

          {(item.upvotes?.length || 0) >= 10 && (
            <View style={styles.helpfulBadge}>
              <Text style={styles.helpfulText}>Helpful</Text>
            </View>
          )}
        </View>

        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </Animated.View>
  );
};

/* =====================
   MAIN SCREEN
===================== */
export default function ChannelChat() {
  const { id: channelId, name } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const socketRef = useRef(null);

  /* 🔐 Load user */
  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      const d = decodeJWT(t);
      if (d) {
        setUserId(d.userId);
        setUsername(d.username);
      }
    });
  }, []);

  /* 📥 Load messages */
  useEffect(() => {
    if (!channelId) return;
    getMessages(channelId).then((d) =>
      setMessages(d.messages?.messages ?? [])
    );
  }, [channelId]);

  /* 🔌 Socket */
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(BASE_URL, {
      transports: ["websocket"],
      auth: { userId },
    });

    socketRef.current.emit("joinChannel", { channelId });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((p) =>
        p.some((m) => m._id === msg._id) ? p : [...p, msg]
      );
    });

    socketRef.current.on("messageUpdated", (msg) => {
      setMessages((p) =>
        p.map((m) => (m._id === msg._id ? msg : m))
      );
    });

    return () => socketRef.current.disconnect();
  }, [userId]);

  /* ✉️ Send */
  const sendMessage = () => {
    if (!input.trim()) return;

    socketRef.current.emit("sendMessage", {
      channelId,
      userId,
      username,
      text: input,
      parentId: replyTo?._id || null,
    });

    setInput("");
    setReplyTo(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* 🔥 HEADER (OLD STYLE PRESERVED) */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        style={styles.header}
      >
        <Text style={styles.channelLabel}>Channel</Text>
        <Text style={styles.channelName}>#{name}</Text>
      </LinearGradient>

      <FlatList
        data={messages}
        keyExtractor={(i) => i._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <FeedbackCard
            item={item}
            myId={userId}
            socketRef={socketRef}
            setReplyTo={setReplyTo}
          />
        )}
      />

      {replyTo && (
        <View style={styles.replyPreview}>
          <Text style={styles.replyText}>
            Replying to {replyTo.username}
          </Text>
          <Pressable onPress={() => setReplyTo(null)}>
            <Text style={styles.replyClose}>✕</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Write feedback…"
          style={styles.input}
        />
        <Pressable onPress={sendMessage}>
          <LinearGradient
            colors={["#7860E3", "#D66767"]}
            style={styles.sendBtn}
          >
            <Text style={styles.sendText}>➤</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },

  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  channelLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },

  channelName: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },

  card: {
    width: "92%",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },

  myCard: {
    alignSelf: "flex-end",
    backgroundColor: "#dcfce7",
  },

  otherCard: {
    alignSelf: "flex-start",
  },

  username: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  actionBtn: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  actionText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  helpfulBadge: {
    backgroundColor: "#bbf7d0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  helpfulText: {
    fontSize: 11,
    fontFamily: "Poppins-Bold",
    color: "#166534",
  },

  time: {
    fontSize: 11,
    color: "#6b7280",
  },

  replyPreview: {
    backgroundColor: "#eef2ff",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  replyText: { fontFamily: "Poppins-Medium" },

  replyClose: { fontFamily: "Poppins-Bold", color: "red" },

  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
  },

  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 24,
    paddingHorizontal: 16,
    fontFamily: "Poppins-Regular",
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
});
