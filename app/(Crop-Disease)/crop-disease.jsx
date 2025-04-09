import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const CropDisease = () => {
  const [cropName, setCropName] = useState('');
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async (fromCamera = false) => {
    try {
      let result;
      
      if (fromCamera) {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          Alert.alert('Permission required', 'We need camera permission to take photos');
          return;
        }
      } else {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (galleryStatus.status !== 'granted') {
          Alert.alert('Permission required', 'We need gallery permission to select photos');
          return;
        }
      }

      result = await (fromCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
          }));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const analyzeDisease = async () => {
    if (!cropName) {
      Alert.alert('Missing Information', 'Please enter the crop name');
      return;
    }
    
    if (!image) {
      Alert.alert('Missing Image', 'Please select or capture an image');
      return;
    }

    const lowerCrop = cropName.toLowerCase().trim();
    if (!['paddy', 'grape', 'potato'].includes(lowerCrop)) {
      Alert.alert('Invalid Crop', 'Supported crops are Paddy, Grape, Potato');
      return;
    }

    setIsAnalyzing(true);
    
    const formData = new FormData();
    formData.append('disease_type', lowerCrop);
    formData.append('lang', 'en');
    formData.append('file', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg'
    });

    try {
      const response = await fetch('http://10.25.12.80:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await response.json();
      Alert.alert(
        'Analysis Complete',
        `Disease: ${data.translated_class || data.predicted_class}\n\n` +
        `Confidence: ${(data.confidence * 100).toFixed(2)}%\n\n` +
        `Cause: ${data.cause}\n\n` +
        `Prevention: ${data.prevention}\n\n` +
        `Treatment: ${data.treatment}`
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
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
          <Image source={{ uri: image }} className="w-full h-80 rounded-xl mb-3" />
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