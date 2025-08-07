import './globals.css';
import {SplashScreen, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import '@/app/globals.css';
export default function RootLayout() {
  // functional
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf')
  })

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync(); // helps loader	// coming from expo router
  }, [fontsLoaded, error]); // any change load again means

  return (
      <Stack screenOptions={{ headerShown: false }} />
  );
}
