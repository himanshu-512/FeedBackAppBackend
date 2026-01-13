import { useEffect, useState, useRef } from "react";
import { View, FlatList, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import { getMessages } from "../../services/api";
import ip from "../../services/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChannelChat() {
  const { id: channelId, name, members } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMember, setIsMember] = useState(false); // ✅ NEW
  const listRef = useRef(null);
  const socketRef = useRef(null);
   const [userId, setUserId] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem("userId").then(setUserId);
  }, []);

  const USER_ID = userId; // later AsyncStorage se

  // 🔑 CHECK MEMBERSHIP
  useEffect(() => {
    if (members && members.includes(USER_ID)) {
      setIsMember(true);
    }
  }, []);

  // 1️⃣ LOAD OLD MESSAGES
  useEffect(() => {
    getMessages(channelId)
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => console.log("MSG ERROR:", err.message));
  }, [channelId]);

  // 2️⃣ SOCKET CONNECT
  useEffect(() => {
    socketRef.current = io(`http://${ip}:4003`, {
      transports: ["websocket"],
      auth: {
        userId: USER_ID,
      },
    });

    socketRef.current.emit("joinChannel", { channelId });

    socketRef.current.on("newMessage", (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    });

    socketRef.current.on("errorMessage", (err) => {
      alert(err.message); // backend message
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [channelId]);

  // 3️⃣ AUTO SCROLL
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 4️⃣ SEND MESSAGE (ONLY IF MEMBER)
  const sendMessage = () => {
    if (!isMember) return;
    if (!input.trim()) return;

    socketRef.current.emit("sendMessage", {
      channelId,
      userId: USER_ID,
      username: USER_ID,
      text: input,
    });

    setInput("");
  };

  // 5️⃣ JOIN CHANNEL
  const joinChannel = async () => {
    await fetch(`http://${ip}:3000/channels/${channelId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      },
    });

    setIsMember(true);
  };

  return (
    <>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* JOIN BUTTON */}
      {!isMember && (
        <Pressable
          onPress={joinChannel}
          style={{
            backgroundColor: "#7860E3",
            padding: 12,
            margin: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>
            Join channel to chat
          </Text>
        </Pressable>
      )}

      {/* INPUT BAR */}
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={
            isMember ? "Write anonymously..." : "Join channel to send messages"
          }
          editable={isMember} // ✅ IMPORTANT
          style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            borderRadius: 20,
            paddingHorizontal: 12,
            opacity: isMember ? 1 : 0.5,
          }}
        />

        <Pressable
          onPress={sendMessage}
          disabled={!isMember}
          style={{ marginLeft: 10, opacity: isMember ? 1 : 0.4 }}
        >
          <Text>Send</Text>
        </Pressable>
      </View>
    </>
  );
}
