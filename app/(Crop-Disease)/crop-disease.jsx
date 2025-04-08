import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const CropDisease = () => {
  const [cropName, setCropName] = useState('');
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async (fromCamera = false) => {
    let result;
    
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera permission to take photos');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeDisease = () => {
    if (!cropName) {
      Alert.alert('Missing Information', 'Please enter the crop name');
      return;
    }
    
    if (!image) {
      Alert.alert('Missing Image', 'Please select or capture an image');
      return;
    }
    
    setIsAnalyzing(true);
    // Here you would typically call your disease detection API
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert('Analysis Complete', `Disease analysis for ${cropName} is complete!`);
    }, 2000);
  };

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-2xl font-bold text-green-700 mb-5 text-center">
        Crop Disease Detection
      </Text>
      
      {/* Crop Name Input */}
      <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-5 shadow-md">
        <MaterialIcons name="local-florist" size={24} color="#4CAF50" />
        <TextInput
          className="flex-1 ml-3 text-base"
          placeholder="Enter crop name (e.g., Tomato, Rice)"
          value={cropName}
          onChangeText={setCropName}
        />
      </View>
      
      {/* Image Section */}
      <View className="mb-5">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-64 rounded-xl mb-3" />
        ) : (
          <View className="w-full h-64 bg-gray-200 rounded-xl mb-3 justify-center items-center">
            <FontAwesome name="photo" size={50} color="#9E9E9E" />
            <Text className="text-gray-500 mt-3">No image selected</Text>
          </View>
        )}
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="flex-1 bg-green-700 py-4 rounded-xl mr-1 items-center" 
            onPress={() => pickImage(false)}
          >
            <Text className="text-white font-bold">Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 bg-blue-500 py-4 rounded-xl ml-1 items-center"
            onPress={() => pickImage(true)}
          >
            <Text className="text-white font-bold">Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Analyze Button */}
      <TouchableOpacity 
        className={`py-4 rounded-xl ${isAnalyzing ? 'bg-gray-400' : 'bg-green-900'}`}
        onPress={analyzeDisease}
        disabled={isAnalyzing}
      >
        <Text className="text-white font-bold text-center">
          {isAnalyzing ? 'Analyzing...' : 'Detect Disease'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CropDisease;