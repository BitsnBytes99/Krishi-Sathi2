import { View, Text, StyleSheet, Image, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SmartFarm = () => {
  const [sensorData, setSensorData] = useState({})
  const [heatmapUri, setHeatmapUri] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Replace with your actual API base URL
  const API_BASE_URL = 'http://192.168.220.31:8080'

  // In your fetchData function:
const fetchData = async () => {
  try {
    setRefreshing(true)
    setLoading(true)
    setError(null)
    
    // Fetch all sensor data
    const dataResponse = await axios.get(`${API_BASE_URL}/all-data`)
    setSensorData(dataResponse.data)
    
    // Get latest heatmap URL
    const heatmapResponse = await axios.get(`${API_BASE_URL}/latest-heatmap-url`)
    setHeatmapUri(`${API_BASE_URL}${heatmapResponse.data.url}`)
    
    setLastUpdated(new Date().toLocaleTimeString())
  } catch (error) {
    console.error('Error fetching data:', error)
    setError(`Failed to load data: ${error.message}`)
  } finally {
    setRefreshing(false)
    setLoading(false)
  }
}

  useEffect(() => {
    // Initial data fetch
    fetchData()
    
    // Set up interval for automatic refresh (every minute)
    const interval = setInterval(fetchData, 60000)
    
    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  const renderSensorData = () => {
    return Object.entries(sensorData).map(([deviceName, data]) => {
      const isError = 'error' in data
      const timestamp = new Date(data.timestamp).toLocaleString()
      const sensorData = data.data || {}
      
      return (
        <View key={deviceName} style={styles.sensorCard}>
          <Text style={styles.deviceName}>{deviceName}</Text>
          <Text style={styles.timestamp}>Last updated: {timestamp}</Text>
          
          {isError ? (
            <Text style={styles.errorText}>Error: {data.error}</Text>
          ) : (
            <View style={styles.sensorData}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>🌱 Soil Moisture:</Text>
                <Text style={styles.dataValue}>{sensorData.soil_moisture_percent || '--'}%</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>🌡️ Temperature:</Text>
                <Text style={styles.dataValue}>{sensorData.temperature || '--'}°C</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>💧 Humidity:</Text>
                <Text style={styles.dataValue}>{sensorData.humidity || '--'}%</Text>
              </View>
            </View>
          )}
        </View>
      )
    })
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    >
      <Text style={styles.title}>Smart Farm Monitoring</Text>
      
      {lastUpdated && (
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Heatmap Section */}
      <Text style={styles.sectionTitle}>Soil Moisture Heatmap</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
        </View>
      ) : heatmapUri ? (
        <Image 
          source={{ uri: heatmapUri }} 
          style={styles.heatmapImage}
          resizeMode="contain"
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      ) : (
        <Text style={styles.noDataText}>Heatmap not available</Text>
      )}
      
      {/* Sensor Data Section */}
      <Text style={styles.sectionTitle}>Sensor Data</Text>
      {loading && Object.keys(sensorData).length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2c3e50" />
          <Text style={styles.loadingText}>Loading sensor data...</Text>
        </View>
      ) : Object.keys(sensorData).length > 0 ? (
        renderSensorData()
      ) : (
        <Text style={styles.noDataText}>No sensor data available</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#34495e',
  },
  heatmapImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  sensorCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  sensorData: {
    marginTop: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dataLabel: {
    fontSize: 14,
    color: '#34495e',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  errorContainer: {
    backgroundColor: '#fdecea',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#e74c3c',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginVertical: 20,
  },
})

export default SmartFarm