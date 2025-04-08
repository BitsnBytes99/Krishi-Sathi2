import "../global.css"
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import {  Stack } from "expo-router";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Inter_400Regular } from "@expo-google-fonts/inter";
export default function Rootlayout() {

    // Load Fonts
    const [fontsLoaded] = useFonts({
      Poppins_SemiBold: Poppins_600SemiBold,
      Inter_Regular: Inter_400Regular,
      "OutfitRegular" : require("../assets/fonts/Outfit-Regular.ttf"),
      "OutfitMedium" : require("../assets/fonts/Outfit-Medium.ttf"),
      "OutfitBold" : require("../assets/fonts/Outfit-Bold.ttf"),
    });
  
  
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(Profile)" options={{ headerShown: false }} />
      <Stack.Screen name="(Crop-Disease)" options={{ headerShown: false }} />
      <Stack.Screen name="(Govt-Scheme)" options={{ headerShown: false }} />
      <Stack.Screen name="(Weather)" options={{ headerShown: false }} />
    </Stack>
  );
}
