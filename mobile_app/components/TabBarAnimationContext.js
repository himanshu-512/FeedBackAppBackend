import { createContext, useContext } from "react";
import {
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

const TabBarAnimationContext = createContext(null);

const HIDE_DISTANCE = 60;      // 👈 how much scroll before hiding
const TAB_HIDE_Y = 200;        // 👈 how far tab moves down

export function TabBarAnimationProvider({ children }) {
  const translateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const isHidden = useSharedValue(false); // 👈 prevent re-trigger

  const onScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.value;

    // SCROLL UP → HIDE (after threshold)
    if (
      diff > 0 &&
      currentY > HIDE_DISTANCE &&
      !isHidden.value
    ) {
      isHidden.value = true;
      translateY.value = withTiming(TAB_HIDE_Y, {
        duration: 1000, // 👈 slower hide
        easing: Easing.out(Easing.cubic),
      });
    }

    // SCROLL DOWN → SHOW (immediate)
    if (diff < 0 && isHidden.value) {
      isHidden.value = false;
      translateY.value = withTiming(0, {
        duration: 500, // 👈 faster show
        easing: Easing.out(Easing.cubic),
      });
    }

    lastScrollY.value = currentY;
  };

  return (
    <TabBarAnimationContext.Provider
      value={{ translateY, onScroll }}
    >
      {children}
    </TabBarAnimationContext.Provider>
  );
}

export function useTabBarAnimation() {
  const ctx = useContext(TabBarAnimationContext);
  if (!ctx) {
    throw new Error(
      "useTabBarAnimation must be used inside TabBarAnimationProvider"
    );
  }
  return ctx;
}
