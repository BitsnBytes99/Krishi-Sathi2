import { TouchableOpacity, Text, View } from "react-native";

const CustomButton = ({ 
  title, 
  onPress, 
  className = "bg-green-700 py-4 rounded-lg w-4/5 mx-auto", 
  textClass = "text-white text-lg font-bold text-center" 
}) => {
  return (
    <View className="w-full items-center"> 
      <TouchableOpacity className={className} onPress={onPress} activeOpacity={0.7}>
        <Text className={textClass}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
