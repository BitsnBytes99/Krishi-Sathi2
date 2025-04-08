import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SensorScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your ESP8266's IP address
  const ESP_IP = '192.168.220.211';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${ESP_IP}/data`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Sensor</Text>
      
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Temperature:</Text>
        <Text style={styles.value}>
          {data.temperature}°C ({(data.temperature * 9/5 + 32).toFixed(1)}°F)
        </Text>
      </View>
      
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Humidity:</Text>
        <Text style={styles.value}>{data.humidity}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  dataContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#666',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default SensorScreen;