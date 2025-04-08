import React from "react";
import { Stack } from "expo-router";


export default function GovtSchemeslayout() {
  return (
      <Stack>
        <Stack.Screen name="govt-schemes" options={{ headerShown: false }} /> 
        <Stack.Screen name="[id]" options={{ headerShown: false }} />    
      </Stack>   
  );
}