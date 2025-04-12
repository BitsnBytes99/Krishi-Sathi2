import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CallSupport = () => {
  const handleCall = async () => {
    try {
      const response = await fetch('https://core-saas.voicegenie.ai/api/v1/pushCallToCampaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: '305a1ae3d27846cf5882bae9139b0851',
          workspaceId: '67f808acb7e0d6f27e6fed06',
          campaignId: 'cfee6e07-15df-4316-9b49-a9f69279d791',
          customerNumber: '+919356281247',
          customerInformation: {
            first_name: 'Farmer',
            last_name: 'User',
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Call Initiated!', 'AgriMitra support will call you shortly.');
      } else {
        Alert.alert('Call Failed', data.message || 'Unable to place the call.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to connect to VoiceGenie.');
    }
  };

  return (
    <ScrollView className="p-5 bg-white flex-1">
      {/* Header */}
      <Text className="text-2xl font-[OutfitBold] text-green-800 mb-1">AgriMitra AI Support</Text>
      <Text className="text-gray-600 mb-6">Get instant agricultural assistance</Text>
      
      {/* Nearby Krushi Bhavan Card */}
      <View className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
        <Text className="text-lg font-semibold text-green-800 mb-3">Nearby Krushi Bhavan (Pune)</Text>
        
        {/* Address 1 */}
        <View className="flex-row items-start mb-3">
          <Ionicons name="location" size={18} color="#4CAF50" className="mt-1 mr-2" />
          <View>
            <Text className="font-medium text-gray-800">Main Krushi Bhavan, Shivajinagar</Text>
            <Text className="text-gray-600">Opposite Council Hall, Pune - 411005</Text>
            <Text className="text-gray-500 text-sm mt-1">Open: 9 AM - 5 PM (Mon-Sat)</Text>
          </View>
        </View>
        
        {/* Address 2 */}
        <View className="flex-row items-start">
          <Ionicons name="location" size={18} color="#4CAF50" className="mt-1 mr-2" />
          <View>
            <Text className="font-medium text-gray-800">Krushi Bhavan, Kothrud</Text>
            <Text className="text-gray-600">Near Kothrud Depot, Pune - 411038</Text>
            <Text className="text-gray-500 text-sm mt-1">Open: 10 AM - 6 PM (Mon-Sat)</Text>
          </View>
        </View>
      </View>
      
      {/* Call Support Button */}
      <TouchableOpacity
        onPress={handleCall}
        className="bg-green-600 py-4 px-6 rounded-full flex-row items-center justify-center shadow-md shadow-green-200 mb-6"
        activeOpacity={0.8}
      >
        <Ionicons name="call" size={20} color="white" className="mr-2" />
        <Text className="text-white font-bold text-lg">Call AgriMitra Support</Text>
      </TouchableOpacity>
      
      {/* Additional Info */}
      <Text className="text-gray-500 text-center mb-8 text-sm">
        Our AI support agent will call you within 30 seconds
      </Text>
      
      {/* Drone Feature Coming Soon */}
      <View className="bg-blue-50 rounded-lg p-5 border border-blue-100 mb-6">
        <View className="flex-row items-center mb-3">
          <Ionicons name="airplane" size={24} color="#3B82F6" className="mr-3" />
          <Text className="text-xl font-bold text-blue-800">Drone Technology Coming Soon!</Text>
        </View>
        
        <Text className="text-gray-700 mb-4">
          We're excited to announce our upcoming drone feature that will revolutionize your farming experience:
        </Text>
        
        <View className="mb-4">
          <View className="flex-row items-start mb-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" className="mt-1 mr-2" />
            <Text className="text-gray-700 flex-1">Automated crop monitoring and analysis</Text>
          </View>
          <View className="flex-row items-start mb-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" className="mt-1 mr-2" />
            <Text className="text-gray-700 flex-1">Precision pesticide spraying</Text>
          </View>
          <View className="flex-row items-start mb-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" className="mt-1 mr-2" />
            <Text className="text-gray-700 flex-1">Soil health assessment</Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" className="mt-1 mr-2" />
            <Text className="text-gray-700 flex-1">Irrigation planning assistance</Text>
          </View>
        </View>
        
        <Text className="text-blue-600 text-sm">
          Launching in the next update! Stay tuned for this groundbreaking feature.
        </Text>
      </View>
    </ScrollView>
  );
};

export default CallSupport;