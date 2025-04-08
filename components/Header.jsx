import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../utils/supabase/client"

const Header = () => {
  const [userName, setUserName] = useState("User"); // Default name
  const [profileInitial, setProfileInitial] = useState("U"); // Default initial

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Fetch additional user data from the profiles table
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile && profile.full_name) {
            // Extract the first name
            const firstName = profile.full_name.split(" ")[0];
            setUserName(firstName);

            // Set the profile initial
            setProfileInitial(firstName[0]?.toUpperCase() || "U");
          } else {
            // If no full name, use email to extract name
            const emailName = user.email.split("@")[0];
            setUserName(emailName);
            setProfileInitial(emailName[0]?.toUpperCase() || "U");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View className="p-4 bg-white shadow-md flex-row items-center justify-between">
      {/* Welcome Text */}
      <View>
        <Text className="text-xl font-[OutfitBold]">Welcome, {userName}!</Text>
        <Text className="text-sm font-[OutfitBold] text-gray-500">
          Have a great day!
        </Text>
      </View>

      {/* Profile Circle */}
      <TouchableOpacity
        onPress={() => router.push("/(Profile)/Profile")}
        className="w-12 h-12 bg-green-700 rounded-full items-center justify-center"
        activeOpacity={0.7}
      >
        <Text className="text-white text-lg font-[Outfit-Medium]">
          {profileInitial}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;