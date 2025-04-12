import { View, Animated, Dimensions, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabase/client";

const NotificationBar = () => {
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(width)).current;
  const [notificationText, setNotificationText] = useState("");
  const [loading, setLoading] = useState(true);
  const textWidthRef = useRef(width * 2); // Initial estimate

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alerts')
          .select('title, message')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const combinedText = data.map(a => `${a.title} - ${a.message}`).join("  •  ");
          // Duplicate text for seamless looping
          setNotificationText(combinedText + "  •  " + combinedText);
        } else {
          setNotificationText("No alerts available • No alerts available");
        }
      } catch (error) {
        console.error("Error:", error);
        setNotificationText("Latest updates loading... • Latest updates loading...");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    if (!notificationText) return;

    const animationDuration = notificationText.length * 50; // Adjust speed

    const animate = () => {
      Animated.timing(scrollX, {
        toValue: -textWidthRef.current / 2, // Scroll halfway (since text is duplicated)
        duration: animationDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          scrollX.setValue(width);
          animate();
        }
      });
    };

    animate();

    return () => scrollX.stopAnimation();
  }, [notificationText]);

  if (loading) {
    return (
      <View className="bg-green-700 px-4 py-2">
        <Text className="text-white">Loading updates...</Text>
      </View>
    );
  }

  return (
    <View className="bg-green-700 px-4 py-2 overflow-hidden mt-4">
      <Animated.Text
        numberOfLines={1}
        style={{
          transform: [{ translateX: scrollX }],
          width: '100%',
        }}
        className="text-white font-bold text-base whitespace-nowrap"
        onLayout={(e) => {
          textWidthRef.current = e.nativeEvent.layout.width;
        }}
      >
        {notificationText}
      </Animated.Text>
    </View>
  );
};

export default NotificationBar;