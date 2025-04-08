import React from 'react';
import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
   <Tabs>
    <Tabs.Screen name='Home' options={
      { 
        title:'Home',
        headerShown: false,
        tabBarIcon:({color})=><Entypo name="home" size={24} color="black" />
      }
    }/>
    <Tabs.Screen name='chatbox'
    options={
      { 
        title:'Chatbox',
        headerShown: false,
        tabBarIcon:({color})=><Ionicons name="chatbox" size={24} color="black" />
      }
    }/>
    <Tabs.Screen name='smartfarm'
    options={
      { 
        title:'SmartFarm',
        headerShown: false,
        tabBarIcon:({color})=><MaterialIcons name="devices-other" size={24} color="black" />
      }
    }/>
    <Tabs.Screen name='profile'
    options={
      { 
        title:'Profile',
        headerShown: false,
        tabBarIcon:({color})=><Ionicons name="person-sharp" size={24} color="black" />
      }
    }/>
   </Tabs>
  );
}