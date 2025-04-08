
import React from "react";
import { Stack } from "expo-router";


export default function Profilelayout() {
  return (
   
      <Stack>
        <Stack.Screen name="Profile" options={{ headerShown: false }} />
       
      </Stack>
    
  );
}
