// screens/SignIn.js
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Poppins_600SemiBold, Inter_400Regular } from "@expo-google-fonts/inter";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signIn, loading } = useAuth();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_SemiBold: Poppins_600SemiBold,
    Inter_Regular: Inter_400Regular,
  });

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await signIn(email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      let errorMessage = "Failed to sign in";
      
      // Handle specific Supabase errors
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email first";
      }
      
      Alert.alert("Sign In Error", errorMessage);
    }
  };

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "Poppins_SemiBold" }}>
        Welcome Back
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg p-4 mb-4"
        style={{ fontFamily: "Inter_Regular" }}
      />

      <View className="border border-gray-300 rounded-lg p-4 mb-6 flex-row items-center">
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          className="flex-1"
          style={{ fontFamily: "Inter_Regular" }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        className={`bg-blue-500 p-4 rounded-lg ${loading ? "opacity-50" : ""}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold" style={{ fontFamily: "Poppins_SemiBold" }}>
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push("/sign-up")} 
        className="mt-4"
        disabled={loading}
      >
        <Text className="text-center text-blue-500" style={{ fontFamily: "Inter_Regular" }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push("/reset-password")} 
        className="mt-2"
        disabled={loading}
      >
        <Text className="text-center text-gray-500" style={{ fontFamily: "Inter_Regular" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;