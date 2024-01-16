document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const enterCityInput = document.getElementById('enter-city');
    const searchButton = document.getElementById('search-button');
    const clearHistoryButton = document.getElementById('clear-history');
    const historyForm = document.getElementById('history');
    const todayWeatherCard = document.getElementById('today-weather');
    const fiveDayForecastContainer = document.getElementById('five-day-forecast');

   // Array to store search history
   let searchHistory = [];
  
   // Event listener for the search button
   searchButton.addEventListener('click', function () {
     // Get the city name from the input, trim any extra spaces
     const cityName = enterCityInput.value.trim();
     if (cityName !== '') {
       // Fetch weather data for the entered city
       getWeatherData(cityName);
       // Clear the input field
       enterCityInput.value = '';
     }
   });
 
   // Event listener for the clear history button
   clearHistoryButton.addEventListener('click', function () {
     // Clear the search history
     clearSearchHistory();
   });
    // Function to fetch weather data for London on page load
    function getDefaultWeather() {
        // You can change 'London' to any default city you prefer
        getWeatherData('London');
      }
    
      // Invoke the default weather function on page load
      getDefaultWeather();
    
      // Function to fetch weather data from OpenWeatherMap API
      async function getWeatherData(cityName) {
        const apiKey = 'b0bd9b4eb2c0ab32b7e8bb3f59b60b76';
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    
        try {
          // Fetch current weather and forecast data concurrently using Promise.all
          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
          ]);
    
          // Parse JSON responses
          const [currentData, forecastData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json(),
          ]);
    
          // Check if the city is not found
          if (currentData.cod === '404' || forecastData.cod === '404') {
            alert('City not found. Please try again.');
            return;
          }
    
          // Display the current weather and 5-day forecast
          displayCurrentWeather(currentData);
          displayFiveDayForecast(forecastData);
    
          // Add the city to the search history
          addToSearchHistory(cityName);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }