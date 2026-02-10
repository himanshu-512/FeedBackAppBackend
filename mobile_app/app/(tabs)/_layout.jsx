import React from "react";
import { Tabs } from "expo-router";
import CustomNavBar from "../../components/customTabbar";
import { TabBarAnimationProvider } from "../../components/TabBarAnimationContext";

export default function Layout() {
  return (
    <TabBarAnimationProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          animationDuration: 250,
        }}
        tabBar={(props) => <CustomNavBar {...props} />}
      >
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="search" options={{ title: "Search" }} />
        <Tabs.Screen name="setting" options={{ title: "Analytics" }} />
        <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </TabBarAnimationProvider>
  );
}
