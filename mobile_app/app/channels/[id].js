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
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { getMessages } from "../../services/api";
import { gateWay } from "../../services/apiURL";

const BASE_URL = gateWay;

/* 🔓 PURE JS JWT DECODE */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export default function ChannelChat() {
  const { id: channelId, name } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [typingUser, setTypingUser] = useState(false);

  const socketRef = useRef(null);
  const listRef = useRef(null);
  const typingTimeout = useRef(null);

  /* 🔑 LOAD USER FROM JWT */
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

  /* 🔐 CHECK MEMBERSHIP */
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/channels/${channelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (
          res.ok &&
          data.members?.some((m) => m.userId === userId)
        ) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
      } catch (err) {
        console.log("MEMBERSHIP CHECK ERROR:", err.message);
      }
    };

    if (userId) checkMembership();
  }, [userId, channelId]);

  /* 📥 LOAD MESSAGES */
  useEffect(() => {
    if (!isMember) return;

    getMessages(channelId)
      .then(setMessages)
      .catch((err) =>
        console.log("GET MESSAGE ERROR:", err.message)
      );
  }, [channelId, isMember]);

  /* 🔌 SOCKET */
  useEffect(() => {
    if (!userId || !isMember) return;

    socketRef.current = io(`${BASE_URL}`, {
      transports: ["websocket"],
      auth: { userId },
    });

    socketRef.current.emit("joinChannel", { channelId });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    socketRef.current.on("typing", () => setTypingUser(true));
    socketRef.current.on("stopTyping", () => setTypingUser(false));

    socketRef.current.on("errorMessage", (err) => {
      Alert.alert("Error", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, isMember, channelId]);

  /* ⬇️ AUTO SCROLL */
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, typingUser]);

  /* ✍️ HANDLE TYPING */
  const handleTyping = (text) => {
    setInput(text);

    socketRef.current?.emit("typing", { channelId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { channelId });
    }, 1200);
  };

  /* ✉️ SEND MESSAGE */
  const sendMessage = () => {
    if (!isMember) {
      Alert.alert("Join required", "Please join channel to chat");
      return;
    }

    if (!input.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    socketRef.current.emit("sendMessage", {
      channelId,
      userId,
      username,
      text: input,
    });

    setInput("");
  };

  /* 💬 MESSAGE UI */
  const renderItem = ({ item }) => {
    const isMe = item.userId === userId;

    const time = new Date(item.createdAt || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          {!isMe && (
            <Text style={styles.usernameText}>
              {item.username}
            </Text>
          )}

          <Text style={styles.messageText}>
            {item.isDeleted ? "Message deleted" : item.text}
          </Text>

          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        style={styles.header}
      >
        <Text style={styles.channelLabel}>Channel</Text>
        <Text style={styles.channelName} numberOfLines={1}>
          #{name}
        </Text>
      </LinearGradient>

      {/* 💬 CHAT */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ✍️ TYPING */}
      {typingUser && (
        <Text style={styles.typing}>💬 Someone is typing…</Text>
      )}

      {/* ⌨️ INPUT */}
      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={handleTyping}
          placeholder={
            isMember
              ? "Write anonymously…"
              : "Join channel to chat"
          }
          editable={isMember}
          style={[
            styles.input,
            { opacity: isMember ? 1 : 0.5 },
          ]}
        />

        <Pressable onPress={sendMessage}>
          <LinearGradient
            colors={["#7860E3", "#D66767"]}
            style={[
              styles.sendBtn,
              { opacity: input.trim() ? 1 : 0.4 },
            ]}
          >
            <Text style={styles.sendText}>➤</Text>
          </LinearGradient>
        </Pressable>
      </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  channelLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  channelName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  bubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: "#7feceb7d",
    borderTopRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 4,
  },

  usernameText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    marginBottom: 2,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#000",
  },

  time: {
    fontSize: 10,
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  typing: {
    marginLeft: 20,
    marginBottom: 6,
    color: "#777",
    fontStyle: "italic",
  },

  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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
    fontWeight: "800",
  },
});
