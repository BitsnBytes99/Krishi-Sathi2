import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import images from "../constants/images";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter()
  return (
    <ImageBackground
      source={images.indexImage}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      resizeMode="cover"
    >
      {/* Slogan & Button Container */}
      <View className="absolute bottom-8 px-6 py-4 items-center bg-white rounded-3xl flex-1 w-full ">
        {/* Slogan */}
        <Text className="text-black text-3xl font-semibold text-center mb-2 mt-0  rounded-xl p-4 leading-tight">
          <Text className="text-primary">
            कृषी{" "}
          </Text>
          साथी{"\n"}
          <Text className="text-primary ">
            Krishi{" "}
          </Text>
          Sathi
        </Text>

        <Text className="text-black text-lg font-semibold text-center mb-6 rounded-xl p-3">
          कृषी साथी शेतकऱ्यांसाठी तंत्रज्ञानाची साथ, समृद्धीची वाट!
        </Text>

        {/* Custom Button */}
        <TouchableOpacity
          className="w-4/5 bg-green-700 py-4 rounded-xl"

          onPress={() => router.push("/(auth)/sign-in")}
          activeOpacity={0.7}
        >
          <Text className="text-white text-lg font-bold text-center">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Index;
