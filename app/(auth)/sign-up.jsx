import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import images from '../../constants/images'
import { router } from 'expo-router'

const signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [district, setDistrict] = useState('')
  const [phone, setPhone] = useState('')
  
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
  

  const handleSignup = () => {
    if (!name || !email || !password || !district || !phone) {
      Alert.alert("Error", "All fields are required.")
      return
    }

    // You can proceed to handle signup logic here (API call, etc.)
    Alert.alert("Success", "Signup successful!")
  }

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
          style={{
            backgroundColor: "#678a1d",
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* Redirect to Sign In */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.push("/sign-in")} className="mt-4">
          <Text className="text-center text-blue-600" style={{ fontFamily: "Inter_Regular" }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
        </View>
    </ImageBackground>
  )
}

export default signup
