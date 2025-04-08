
import React from "react";
import { Stack } from "expo-router";


export default function Weatherlayout() {
  return (
   
      <Stack>
        <Stack.Screen name="weatheradvise" options={{ headerShown: false }} />
       
      </Stack>
    
  );
}
