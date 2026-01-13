import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarHidden: false,

        // 🔥 SMOOTH SCREEN TRANSITION
        animation: "slide_from_right",
        animationDuration: 400,

        // Extra polish (iOS-like)
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="anonymous" />
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
