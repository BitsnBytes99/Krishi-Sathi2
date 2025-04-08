import { View, Text, Animated, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";

const NotificationBar = () => {
  const { width } = Dimensions.get("window"); // Get screen width
  const scrollX = useRef(new Animated.Value(width)).current; // Start from right side

  const notifications = [
    " प्रधानमंत्री किसान सन्मान निधी योजनेचा लाभ घ्या!",
    "🌱बळीराजा योजना अंतर्गत शेतकऱ्यांना मदत निधी मंजूर!",
  ];

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(scrollX, {
        toValue: -width * 2, // Move text far left
        duration: 12000, // Adjust speed (8s)
        useNativeDriver: true,
      }).start(() => {
        scrollX.setValue(width); // Reset position
        startAnimation(); // Loop animation
      });
    };

    startAnimation();
  }, [scrollX]);

  return (
    <View className="bg-green-700 px-7 py-2 rounded-lg mt-4 mb-2 overflow-hidden">
      <Animated.Text
        style={{
          transform: [{ translateX: scrollX }],
          width: width * 2, // Extend text width for smooth looping
        }}
        className="text-white font-bold text-base"
      >
        {notifications.join("  •  ")} {/* Separate messages with a bullet */}
      </Animated.Text>
    </View>
  );
};

export default NotificationBar;
