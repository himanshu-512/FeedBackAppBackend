// Splash.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function Splash({ onFinish }) {
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 2500); // duration of animation
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animastion/SplashScreen.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
