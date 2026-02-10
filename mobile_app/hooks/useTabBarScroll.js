import { useSharedValue, withTiming } from "react-native-reanimated";

export function useTabBarScroll(tabHeight = 90) {
  const tabTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const onScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;

    // SCROLL UP → HIDE TAB
    if (currentY > lastScrollY.value && currentY > 20) {
      tabTranslateY.value = withTiming(tabHeight, { duration: 250 });
    }

    // SCROLL DOWN → SHOW TAB
    if (currentY < lastScrollY.value) {
      tabTranslateY.value = withTiming(0, { duration: 200 });
    }

    lastScrollY.value = currentY;
  };

  return { tabTranslateY, onScroll };
}
