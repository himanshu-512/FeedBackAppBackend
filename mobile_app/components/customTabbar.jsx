import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTabBarAnimation } from "./TabBarAnimationContext"; // ✅ CONTEXT
import { useFonts } from "expo-font";



const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";

export default function CustomtabBar({
  state,
  descriptors,
  navigation,
}) {

  const [fontsLoaded] = useFonts({
  PoppinsLight: require("../assets/font/Poppins/Poppins-Light.ttf"),
  PoppinsRegular: require("../assets/font/Poppins/Poppins-Regular.ttf"),
  PoppinsMedium: require("../assets/font/Poppins/Poppins-Medium.ttf"),
  PoppinsSemiBold: require("../assets/font/Poppins/Poppins-SemiBold.ttf"),
  PoppinsBold: require("../assets/font/Poppins/Poppins-Bold.ttf"),
  PoppinsExtraBold: require("../assets/font/Poppins/Poppins-ExtraBold.ttf"),
});
  // ✅ GET SHARED VALUE FROM CONTEXT
  const { translateY } = useTabBarAnimation();

  // ✅ APPLY ANIMATION
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel ??
          options.title ??
          route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            key={route.key}
            layout={LinearTransition.springify().mass(0.5)}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused
                  ? SECONDARY_COLOR
                  : "transparent",
              },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? PRIMARY_COLOR : SECONDARY_COLOR
            )}

            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}
              >
                {label}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

function getIconByRouteName(routeName, color) {
  switch (routeName) {
    case "index":
      return <Feather name="home" size={18} color={color} />;
    case "search":
      return <AntDesign name="search" size={18} color={color} />;
    case "setting":
      return <Ionicons name="bar-chart-outline" size={18} color={color} />;
    case "wallet":
      return <Ionicons name="wallet-outline" size={18} color={color} />;
    case "profile":
      return <FontAwesome6 name="circle-user" size={18} color={color} />;
    default:
      return <Feather name="home" size={18} color={color} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#1E1B4B",
    width: "80%",
    alignSelf: "center",
    bottom: 40,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});
