import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Replace with your ESP8266's IP address
  const ESP_IP = '192.168.220.211';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${ESP_IP}/data`);
        setSensorData(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a8cff" />
        <Text style={styles.loadingText}>Connecting to sensor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.helpText}>Please check:
          {"\n"}• ESP8266 is powered on
          {"\n"}• Correct IP address
          {"\n"}• Same WiFi network
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Environment Dashboard</Text>
      <Text style={styles.subHeader}>Last updated: {lastUpdated}</Text>
      
      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        {/* Temperature Tile */}
        <View style={[styles.tile, styles.temperatureTile]}>
          <Text style={styles.tileTitle}>Temperature</Text>
          <Text style={styles.tileValue}>{sensorData.temperature}°C</Text>
          <Text style={styles.tileSubValue}>
            {((sensorData.temperature * 9/5) + 32).toFixed(1)}°F
          </Text>
          <Text style={styles.tileStatus}>
            {sensorData.temperature > 30 ? '🔥 Hot' : 
             sensorData.temperature < 15 ? '❄️ Cold' : '😊 Normal'}
          </Text>
        </View>

        {/* Humidity Tile */}
        <View style={[styles.tile, styles.humidityTile]}>
          <Text style={styles.tileTitle}>Humidity</Text>
          <Text style={styles.tileValue}>{sensorData.humidity}%</Text>
          <Text style={styles.tileStatus}>
            {sensorData.humidity > 70 ? '💧 Humid' : 
             sensorData.humidity < 30 ? '🏜️ Dry' : '👍 Normal'}
          </Text>
        </View>

        {/* Soil Moisture Tile */}
        <View style={[styles.tile, styles.soilTile]}>
          <Text style={styles.tileTitle}>Soil Moisture</Text>
          <Text style={styles.tileValue}>{sensorData.soil_moisture_percent}%</Text>
          <Text style={styles.tileSubValue}>
            Raw: {sensorData.soil_moisture_raw}
          </Text>
          <Text style={styles.tileStatus}>
            {sensorData.soil_moisture_percent > 70 ? '💦 Wet' : 
             sensorData.soil_moisture_percent < 30 ? '🏜️ Dry' : '🌱 Good'}
          </Text>
        </View>

        {/* Rain Detection Tile */}
        <View style={[styles.tile, styles.rainTile, 
                      sensorData.is_raining ? styles.raining : styles.notRaining]}>
          <Text style={styles.tileTitle}>Rain Status</Text>
          <Text style={styles.tileValue}>
            {sensorData.is_raining ? 'RAINING' : 'DRY'}
          </Text>
          <Text style={styles.tileIcon}>
            {sensorData.is_raining ? '🌧️' : '☀️'}
          </Text>
        </View>
      </View>

      {/* Combined Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Garden Status</Text>
        <Text style={styles.statusText}>
          {getGardenStatus(sensorData)}
        </Text>
      </View>
    </ScrollView>
  );
};

// Helper function for garden status
const getGardenStatus = (data) => {
  if (data.is_raining && data.soil_moisture_percent > 80) {
    return "⚠️ Heavy moisture - Consider covering plants";
  }
  if (data.soil_moisture_percent < 30 && data.temperature > 28) {
    return "🚨 Plants need water immediately!";
  }
  if (data.is_raining && data.soil_moisture_percent < 50) {
    return "🌧️ Rain will help your plants";
  }
  return "✅ Conditions are normal";
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff8f8',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 20,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tile: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temperatureTile: {
    backgroundColor: '#ffecb3',
  },
  humidityTile: {
    backgroundColor: '#bbdefb',
  },
  soilTile: {
    backgroundColor: '#d7ccc8',
  },
  rainTile: {
    backgroundColor: '#e3f2fd',
  },
  raining: {
    backgroundColor: '#bbdefb',
  },
  notRaining: {
    backgroundColor: '#fff9c4',
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tileValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  tileSubValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  tileStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  tileIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 8,
  },
  statusContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
});

export default SensorDashboard;