import '@/app/globals.css';
import useAuthStore from "@/store/auth.store";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';
import './globals.css';
export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
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

  useEffect(() => {
    fetchAuthenticatedUser();
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();

  }, [fontsLoaded, error]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
