import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function SchemeCard({ id, title, imageUrl }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(Govt-Scheme)/${id}`)}
      className="rounded-2xl overflow-hidden bg-white shadow-lg"
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-48" // Fixed image height
          resizeMode="cover"
        />
      </View>
      
      {/* Text Content Below Image */}
      <View className="p-4">
        <Text 
          className="text-xl font-bold text-gray-800 mb-2"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        
        {/* View Details Button */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-green-600 text-base font-medium">View Details</Text>
          <View className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Text className="text-green-600 text-sm">→</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}