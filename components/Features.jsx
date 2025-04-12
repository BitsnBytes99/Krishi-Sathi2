import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

// Import local images
import cropImage from "../assets/images/wheat.png";
import farmerImage from "../assets/images/farmer.png";
import droneImage from "../assets/images/drone.png";
import schemeImage from "../assets/images/bonus.png";

const Features = () => {
  const router = useRouter(); // Use Expo Router for navigation

  // Grid buttons data with local images
  const gridData = [
    { title: "Crop Disease Classification", image: cropImage, link: "/(Crop-Disease)/crop-disease" },
    { title: "Farmer Connect", image: farmerImage, link: "/(Farmer-Connect)/farmerconnect" },
    { title: "Weather Connect", image: droneImage, link: "/(Weather)/weatheradvise" },
    { title: "Govt Scheme", image: schemeImage, link: "/(Govt-Scheme)/govt-schemes" },
  ];

  return (
    <View className="flex-2 justify-center bg-gray-100 p-4">
      <Text className="text-xl font-[OutfitBold] m-4 "> Select an Option</Text>

      {/* Grid Layout */}
      <View className="flex-row flex-wrap justify-center gap-9">
        {gridData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.link)}
            className=" bg-green-700 rounded-lg p-6 shadow-lg items-center justify-center w-40 h-40"
          >
            <Image source={item.image} className="w-16 h-16 mb-2" resizeMode="contain" />
            <Text className="text-center font-medium color-white">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Features;
