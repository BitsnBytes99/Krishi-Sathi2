import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated, Easing, ScrollView } from 'react-native';
import { getCurrentWeather } from '../utils/weatherAPI';
import { getUserLocation } from '../utils/location';
import { getCropSuggestions } from '../utils/cropSuggestions';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

// Create an animated version of ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function WeatherAdvisory() {
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const location = await getUserLocation();
        const address = await Location.reverseGeocodeAsync(location);
        setLocationName(
          `${address[0]?.city || address[0]?.region || 'Unknown location'}, ${address[0]?.country || ''}`
        );
        
        const weatherData = await getCurrentWeather(location.latitude, location.longitude);
        setWeather(weatherData);
        setSuggestions(getCropSuggestions(weatherData));
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        ]).start();
        
        setTimeout(() => {
          if (animationRef.current) {
            animationRef.current.play();
          }
        }, 300);
        
      } catch (err) {
        console.error('Error in WeatherAdvisory:', err);
        setError(err.message || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    };
  }, []);

  const getWeatherAnimation = () => {
    if (!weather?.weather?.[0]?.main) {
      return require('../assets/animations/sunny.json');
    }
    
    const condition = weather.weather[0].main.toLowerCase();
    if (condition === 'rain') {
      return require('../assets/animations/rain.json');
    }
    return require('../assets/animations/sunny.json');
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower === 'clear' || conditionLower === 'sunny') {
      return 'wb-sunny';
    }
    if (conditionLower === 'rain') {
      return 'grain';
    }
    return 'wb-cloudy';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#DC2626" />
        <Text style={styles.errorTitle}>⚠️ {error}</Text>
        <Text style={styles.errorText}>
          Please check your connection and location permissions
        </Text>
      </View>
    );
  }

  const weatherCondition = weather?.weather[0]?.main || 'Clear';
  const weatherDescription = weather?.weather[0]?.description || 'N/A';
  const temperature = Math.round(weather?.main?.temp) || '--';
  const humidity = weather?.main?.humidity || '--';
  const windSpeed = weather?.wind?.speed || '--';

  return (
    <AnimatedScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Location Header */}
      <Animated.View 
        style={[
          styles.locationCard,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <MaterialIcons name="location-on" size={24} color="#16A34A" />
        <Text style={styles.locationText}>
          {locationName || 'Your Location'}
        </Text>
      </Animated.View>

      {/* Current Weather */}
      <Animated.View 
        style={[
          styles.weatherCard,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.sectionTitle}>Current Weather</Text>
        
        <View style={styles.weatherContent}>
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={getWeatherAnimation()}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>
          
          <View style={styles.weatherDetails}>
            <View style={styles.weatherRow}>
              <MaterialIcons name="device-thermostat" size={24} color="#EF4444" />
              <Text style={styles.weatherText}>{temperature}°C</Text>
            </View>
            
            <View style={styles.weatherRow}>
              <MaterialIcons name="opacity" size={24} color="#3B82F6" />
              <Text style={styles.weatherText}>{humidity}% Humidity</Text>
            </View>
            
            <View style={styles.weatherRow}>
              <MaterialIcons name="air" size={24} color="#94A3B8" />
              <Text style={styles.weatherText}>{windSpeed} km/h Wind</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.weatherConditionContainer}>
          <MaterialIcons 
            name={getWeatherIcon(weatherCondition)} 
            size={28} 
            color={weatherCondition.toLowerCase() === 'rain' ? '#3B82F6' : '#F59E0B'}
          />
          <Text style={styles.weatherDescription}>
            {weatherDescription}
          </Text>
        </View>
      </Animated.View>

      {/* Crop Protection Advisory */}
      <Animated.View 
        style={[
          styles.advisoryCard,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.sectionTitle}>Crop Protection Advisory</Text>
        
        <View style={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <View key={`suggestion-${index}`} style={styles.suggestionItem}>
              <View 
                style={[
                  styles.suggestionBullet,
                  { backgroundColor: index % 2 === 0 ? '#16A34A' : '#86EFAC' }
                ]} 
              />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.tipContainer}>
          <MaterialIcons name="lightbulb" size={20} color="#D97706" />
          <Text style={styles.tipText}>
            Pro Tip: Check soil moisture before watering. Overwatering can be as harmful as drought for many crops.
          </Text>
        </View>
      </Animated.View>
    </AnimatedScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#166534',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 16,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  animationContainer: {
    width: 128,
    height: 128,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 16,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  weatherConditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
  },
  weatherDescription: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  advisoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  suggestionsList: {
    marginTop: 8,
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
};