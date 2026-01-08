import { useEffect, useState, useRef } from "react";
import { View, FlatList, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import { getMessages } from "../../services/api";

export default function ChannelChat() {
  const { id: channelId } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); // ✅ FIX
  const listRef = useRef(null);
  const socketRef = useRef(null); // ✅ SINGLE SOCKET

  // 1️⃣ LOAD OLD MESSAGES
  useEffect(() => {
    getMessages(channelId).then(setMessages);
  }, [channelId]);

  // 2️⃣ SOCKET CONNECT + LISTEN
  useEffect(() => {
    socketRef.current = io("http://10.193.138.156:4003", {
      transports: ["websocket"],
      auth: {
        userId: "User_4566",
      },
    });

    socketRef.current.emit("joinChannel", { channelId });

    socketRef.current.on("newMessage", (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [channelId]);

  // 3️⃣ AUTO SCROLL
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 4️⃣ SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim()) return;

    socketRef.current.emit("sendMessage", {
      channelId,
      userId: "User_4566",
      username: "User_4566",
      text: input,
    });

    setInput("");
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

      {/* INPUT BAR */}
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Write anonymously..."
          style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            borderRadius: 20,
            paddingHorizontal: 12,
          }}
        />
        <Pressable onPress={sendMessage} style={{ marginLeft: 10 }}>
          <Text>Send</Text>
        </Pressable>
      </View>
    </>
  );
}
