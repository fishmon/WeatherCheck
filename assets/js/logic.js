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