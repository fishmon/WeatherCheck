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
      // Function to display current weather information
    function displayCurrentWeather(data) {
        // Show the weather card
        todayWeatherCard.classList.remove('d-none');
    
        // Update elements with current weather data
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('current-pic').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
        document.getElementById('UV-index').textContent = `UV Index: N/A`; // You may need to fetch UV index separately
      }
       // Function to display 5-day forecast
    function displayFiveDayForecast(data) {
        // Clear previous forecast data
        fiveDayForecastContainer.innerHTML = '';
    
        // Filter forecast entries for 12:00:00 time
        const forecastEntries = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
    
        // Create forecast cards
        forecastEntries.forEach(entry => {
          const card = document.createElement('div');
          card.className = 'col-md-2 forecast bg-primary text-white m-2 rounded';
          card.innerHTML = `
            <p>Date: ${formatDate(entry.dt)}</p>
            <p><img src="http://openweathermap.org/img/wn/${entry.weather[0].icon}.png" /></p>
            <p>Temp: ${entry.main.temp} °C</p>
            <p>Wind: ${entry.wind.speed} m/s</p>
            <p>Humidity: ${entry.main.humidity}%</p>
          `;
          fiveDayForecastContainer.appendChild(card);
        });
    
        // Show the 5-day forecast header
        document.getElementById('fiveday-header').classList.remove('d-none');
      }