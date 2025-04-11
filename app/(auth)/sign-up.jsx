import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import images from '../../constants/images'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [district, setDistrict] = useState('')
  const [phone, setPhone] = useState('')
  const { signUp, loading } = useAuth();
  
  const districts = [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nasik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal"
  ];
  

  const handleSignup = async () => {
    // Basic validation
    if (!name || name.length < 2) {
      Alert.alert("Error", "Please enter a valid name");
      return;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    
    if (!district) {
      Alert.alert("Error", "Please select your district");
      return;
    }
    
    if (!phone || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
  
    try {
      await signUp(email, password, {
        name,
        phone,
        district
      });
      
      // Directly navigate to home after successful signup
      router.replace("/(tabs)/home");
    } catch (error) {
      let errorMessage = "Failed to create account";
      
      if (error.message.includes("Email already registered")) {
        errorMessage = "This email is already registered";
      } else if (error.message.includes("password")) {
        errorMessage = "Password must be at least 6 characters";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "This email is already registered";
      }
      
      Alert.alert("Sign Up Error", errorMessage);
    }
  };

  return (
    <ImageBackground
      source={images.authBack}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
      resizeMode="cover"
    >
      <View style={{ width: '100%', maxWidth: 400, backgroundColor: 'rgba(255, 255, 255, 0)', borderRadius: 20, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Signup</Text>

        {/* Name Input */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name of Farmer"
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        />

        {/* Email Input */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        />

        {/* Password Input */}
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        />

        {/* Phone Number Input */}
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        />

        {/* District Picker */}
        <Picker
          selectedValue={district}
          onValueChange={(itemValue) => setDistrict(itemValue)}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        >
          <Picker.Item label="Select District" value="" />
          {districts.map((districtName, index) => (
            <Picker.Item key={index} label={districtName} value={districtName} />
          ))}
        </Picker>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={{
            backgroundColor: "#678a1d",
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Redirect to Sign In */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={{ color: 'blue', textAlign: 'center' }}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default Signup