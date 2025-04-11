import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, FlatList, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const CROP_OPTIONS = [
  { id: 1, name: 'paddy' },
  { id: 2, name: 'Tomato' },
  { id: 3, name: 'Potato' },
  { id: 4, name: 'Grape' },
];

const CropDisease = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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


  const analyzeDisease = async () => {  // Added async here
    if (!selectedCrop) {
      Alert.alert('Missing Information', 'Please select a crop');
      return;
    }
    
    if (!image) {
      Alert.alert('Missing Image', 'Please select or capture an image');
      return;
    }

    const lowerCrop = selectedCrop.name.toLowerCase().trim();  // Changed from cropName to selectedCrop.name
    if (!['paddy', 'tomato', 'potato', 'grape'].includes(lowerCrop)) {  // Updated to match your CROP_OPTIONS
      Alert.alert('Invalid Crop', 'Supported crops are Rice, Tomato, Potato, Grapes');
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
      const response = await fetch('http://192.168.220.31:8002/predict/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
        `Treatment: ${data.treatment}\n\n` +
        `Youtube Videos:\n${data.youtube_links.map((video, index) => `${index + 1}. ${video.title}\n${video.url}`).join('\n\n')}`
      );
      
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
};

  const renderCropItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedCrop(item);
        setShowDropdown(false);
        console.log(`Selected crop: ${item.name}`); // Log when crop is selected
      }}
    >
      <Text style={styles.dropdownItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-2xl font-bold text-green-700 mb-5 text-center">
        Crop Disease Detection
      </Text>
      
      {/* Crop Selection Dropdown */}
      <View className="mb-5">
        <Text className="text-gray-600 mb-2">Select Crop:</Text>
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-md"
          onPress={() => setShowDropdown(true)}
        >
          <MaterialIcons name="local-florist" size={24} color="#4CAF50" />
          <Text className="flex-1 ml-3 text-base">
            {selectedCrop ? selectedCrop.name : 'Select a crop...'}
          </Text>
          <MaterialIcons 
            name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
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
        disabled={isAnalyzing || !selectedCrop}
      >
        <Text className="text-white font-bold text-center">
          {isAnalyzing ? 'Analyzing...' : 'Detect Disease'}
        </Text>
      </TouchableOpacity>
      
      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownContainer}>
            <FlatList
              data={CROP_OPTIONS}
              renderItem={renderCropItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '60%',
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default CropDisease;
