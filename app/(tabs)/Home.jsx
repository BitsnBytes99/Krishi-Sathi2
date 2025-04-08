import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Header"; 
import Slider from "../../components/Slider";
import NotificationBar from "../../components/NotificationBar";
import Features from "../../components/Features"; // Corrected import for Slider

const Home = () => {
  return (
    <View >
       
      {/* Include the Header component at the top */}
      <Header />

      {/* Include the Slider component */}
      <Slider />

      <NotificationBar />

      <Features/>

    </View>
  );
};

export default Home;
