// utils/weatherAPI.js
const API_KEY = '646f2e697728eac8a525eb7d7ec35e0f';

export const getCurrentWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.main || !data.weather) {
        throw new Error('Invalid weather data structure');
      }
      
      return data;
    } catch (error) {
      console.error('Weather API error:', error);
      throw error; // Re-throw to handle in calling component
    }
  };