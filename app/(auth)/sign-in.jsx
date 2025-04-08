import { View, Text, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { router } from "expo-router";
import images from "../../constants/images";
import Icon from "react-native-vector-icons/Ionicons"; // For eye icon

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load Fonts
  const [fontsLoaded] = useFonts({
    Poppins_SemiBold: Poppins_600SemiBold,
    Inter_Regular: Inter_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Prevent crash
  }

  return (
    <ImageBackground
      source={images.authBack}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
      resizeMode="cover"
    >
      <View className="w-full max-w-md bg-white/90 p-6 rounded-2xl shadow-lg">
        {/* Heading */}
        <Text className="text-3xl text-center text-gray-800" style={{ fontFamily: "Poppins_SemiBold" }}>
          Sign In
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="w-full p-3 mt-6 border border-gray-300 rounded-lg"
          style={{ fontFamily: "Inter_Regular" }}
        />

        {/* Password Input */}
        <View className="w-full p-3 mt-4 border border-gray-300 rounded-lg flex-row items-center">
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            className="flex-1"
            style={{ fontFamily: "Inter_Regular" }}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Sign-In Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Home")}
          className="w-full bg-[#678a1d] p-3 mt-6 rounded-lg"
        >
          <Text className="text-center text-white" style={{ fontFamily: "Poppins_SemiBold" }}>
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Sign-Up Navigation */}
        <TouchableOpacity onPress={() => router.push("/sign-up")} className="mt-4">
          <Text className="text-center text-blue-600" style={{ fontFamily: "Inter_Regular" }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignIn;
