import React from 'react';
import { View, Button, Alert } from 'react-native';

const CallSupport = () => {
  const handleCall = async () => {
    try {
      const response = await fetch('https://core-saas.voicegenie.ai/api/v1/pushCallToCampaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: '305a1ae3d27846cf5882bae9139b0851', // Replace with your VoiceGenie API token
          workspaceId: '67f808acb7e0d6f27e6fed06', // Replace with your workspace ID
          campaignId: '40ed8b67-b2f3-4d82-a6b2-febb3ad99811', // Replace with your campaign ID
          customerNumber: '+919356281247', // User's phone number (e.g., Indian number)
          customerInformation: {
            first_name: 'Farmer', // Custom data (optional)
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
    <View style={{ padding: 20 }}>
      <Button 
        title="Call AgriMitra Support" 
        onPress={handleCall} 
      />
    </View>
  );
};

export default CallSupport;