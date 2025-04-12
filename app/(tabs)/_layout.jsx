import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
   <Tabs screenOptions={{
     tabBarStyle: {
       height: 70,  // Increased from default ~50px
     },
     tabBarItemStyle: {
       paddingVertical: 10,  // Added vertical padding
     },
     tabBarIconStyle: {
       marginBottom: -3,  // Better icon alignment
     },
   }}>
    <Tabs.Screen name='Home' options={
      { 
        title:'Home',
        headerShown: false,
        tabBarIcon:({color})=><Entypo name="home" size={28} color="black" />  // Increased from 24
      }
    }/>
    <Tabs.Screen name='chatbox'
    options={
      { 
        title:'Chatbox',
        headerShown: false,
        tabBarIcon:({color})=><Ionicons name="chatbox" size={28} color="black" />  // Increased from 24
      }
    }/>
    <Tabs.Screen name='smartfarm'
    options={
      { 
        title:'SmartFarm',
        headerShown: false,
        tabBarIcon:({color})=><MaterialIcons name="devices-other" size={28} color="black" />  // Increased from 24
      }
    }/>
    <Tabs.Screen name='profile'
    options={
      { 
        title:'Voice Support',
        headerShown: false,
        tabBarIcon:({color})=><Ionicons name="person-sharp" size={28} color="black" />  // Increased from 24
      }
    }/>
   </Tabs>
  );
}