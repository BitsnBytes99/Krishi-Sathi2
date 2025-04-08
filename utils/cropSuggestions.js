// utils/cropSuggestions.js
export const getCropSuggestions = (weatherData) => {
    // Add defensive checks
    if (!weatherData || !weatherData.main || !weatherData.weather) {
      return ["Unable to analyze weather conditions. Please try again later."];
    }
  
    const { temp, humidity } = weatherData.main;
    const weatherCondition = weatherData.weather[0]?.main || 'Clear';
    
    let suggestions = [];
    
    // Temperature checks
    if (temp !== undefined) {
      if (temp < 5) {
        suggestions.push("❄️ Protect crops from frost using row covers");
      } else if (temp > 35) {
        suggestions.push("☀️ Increase irrigation frequency to prevent heat stress");
      }
    }
    
    // Humidity checks
    if (humidity !== undefined) {
      if (humidity > 80) {
        suggestions.push("💧 Watch for fungal diseases - consider preventive fungicides");
      } else if (humidity < 30) {
        suggestions.push("🏜️ Mulch soil to retain moisture");
      }
    }
    
    // Weather condition checks
    switch (weatherCondition) {
      case 'Rain':
        suggestions.push("🌧️ Delay fertilizer application to prevent runoff");
        break;
      case 'Drizzle':
        suggestions.push("🌦️ Ideal conditions for foliar feeding");
        break;
      case 'Extreme':
        suggestions.push("⚠️ Take immediate protective measures for crops");
        break;
    }
    
    return suggestions.length > 0 
      ? suggestions 
      : ["✅ Weather conditions are favorable for most crops. Monitor regularly."];
  };