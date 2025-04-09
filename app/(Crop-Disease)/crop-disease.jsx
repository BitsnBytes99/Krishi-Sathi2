import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, FlatList, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const CROP_OPTIONS = [
  { id: 1, name: 'Rice' },
  { id: 2, name: 'Tomato' },
  { id: 3, name: 'Potato' },
  { id: 4, name: 'Grapes' },
];

const CropDisease = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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
    if (!selectedCrop) {
      Alert.alert('Missing Information', 'Please select a crop');
      return;
    }
    
    if (!image) {
      Alert.alert('Missing Image', 'Please select or capture an image');
      return;
    }
    
    setIsAnalyzing(true);
    console.log(`Selected crop: ${selectedCrop.name}`);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert(
        'Analysis Complete', 
        `Disease analysis for ${selectedCrop.name} is complete!`
      );
    }, 2000);
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