import "../global.css";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, Redirect } from "expo-router";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import AuthProvider from "../context/AuthContext"; // Import your AuthProvider
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { ActivityIndicator, View } from "react-native";

// This component will handle the auth state and redirects
function AuthLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to home
        router.replace("/(tabs)/Home");
      } else {
        // If not logged in, redirect to auth screen
        router.replace("/sign-in");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(Profile)" options={{ headerShown: false }} />
      <Stack.Screen name="(Crop-Disease)" options={{ headerShown: false }} />
      <Stack.Screen name="(Govt-Scheme)" options={{ headerShown: false }} />
      <Stack.Screen name="(Weather)" options={{ headerShown: false }} />
      <Stack.Screen name="(Farmer-Connect)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  // Load Fonts
  const [fontsLoaded] = useFonts({
    Poppins_SemiBold: Poppins_600SemiBold,
    Inter_Regular: Inter_400Regular,
    "OutfitRegular": require("../assets/fonts/Outfit-Regular.ttf"),
    "OutfitMedium": require("../assets/fonts/Outfit-Medium.ttf"),
    "OutfitBold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}