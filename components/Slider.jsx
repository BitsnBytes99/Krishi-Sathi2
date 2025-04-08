import { View, FlatList, Image, Dimensions } from "react-native";
import React, { useRef, useState, useEffect } from "react";

const Slider = () => {
  const { width } = Dimensions.get("window"); // Get device screen width
  const flatListRef = useRef(null); // Reference for the FlatList
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hardcoded slider images for UI demonstration
  const sliderList = [
    "https://media.istockphoto.com/id/1092520698/photo/indian-farmer-at-onion-field.jpg?s=612x612&w=0&k=20&c=gvu-DzA17EyVSNzvdf7L3R8q0iIvLapG15ktOimqXqU=",
    "https://png.pngtree.com/background/20230823/original/pngtree-3d-rendering-agriculture-drone-spraying-fertilizer-on-sugar-cane-farm-picture-image_4788235.jpg",
    "https://www.cultyvate.com/wp-content/uploads/2023/02/Farmer-Empowered-with-mobile-tech.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderList.length;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]);

  // Render a single image
  const renderItem = ({ item }) => (
    <View className="justify-center items-center" style={{ width }}>
      <Image
        source={{ uri: item }}
        className="h-64 rounded-lg" // Increased height
        style={{ width: width * 0.9 }}
      />
    </View>
  );

  return (
    <View style={{ marginTop: 20 }}> 
      {/* Added margin from top to create space from Header */}
      <FlatList
        ref={flatListRef}
        data={sliderList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

export default Slider;
