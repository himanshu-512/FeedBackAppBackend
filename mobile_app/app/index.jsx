import { View, Text, Image, StatusBar, Dimensions } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar barStyle="dark-content" translucent />

      {/* Push content slightly upward (like your image) */}
      <View style={{ marginTop: -height * 0.05 }} className="items-center">

        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          className="w-32 h-32 mb-5"
          resizeMode="contain"
        />

        {/* App Name */}
        <Text className="text-3xl font-extrabold tracking-wider">
          <Text className="text-purple-500">FEEDBACK </Text>
          <Text className="text-pink-500">CHAT</Text>
        </Text>

      </View>
    </View>
  );
}
