// Get a free API key at https://openweathermap.org/api
const API_KEY = "ec23c5103acb5f05c0e4cd9916dd112c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Get the current weather for a city
export async function getWeather(city) {
  const response = await fetch(`${BASE_URL}/weather?q=${city}&units=imperial&appid=${API_KEY}`);
  const data = await response.json();
  return data;
}

// Get the 5 day forecast for a city
export async function getForecast(city) {
  const response = await fetch(`${BASE_URL}/forecast?q=${city}&units=imperial&appid=${API_KEY}`);
  const data = await response.json();
  return data;
}
