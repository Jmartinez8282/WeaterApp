import { getWeather, getForecast } from "./api.js";
import { getFavorites, addFavorite, removeFavorite } from "./favorites.js";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const icon = document.getElementById("icon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecast = document.getElementById("forecast");
const page = document.getElementById("page");
const bgIcon = document.getElementById("bgIcon");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");

// Pick a background color and picture for each type of weather
const backgrounds = {
  Clear: { colors: "from-yellow-300 to-orange-500", icon: "☀️" },
  Clouds: { colors: "from-gray-400 to-slate-600", icon: "☁️" },
  Rain: { colors: "from-slate-600 to-blue-900", icon: "🌧️" },
  Drizzle: { colors: "from-slate-500 to-blue-800", icon: "🌦️" },
  Thunderstorm: { colors: "from-gray-800 to-purple-900", icon: "⛈️" },
  Snow: { colors: "from-blue-100 to-slate-400", icon: "❄️" },
};
//Testing github actions

async function showWeather() {
  const city = cityInput.value;

  const weather = await getWeather(city);

  // The API sends back cod 200 when the city is found
  if (weather.cod !== 200) {
    cityName.textContent = "City not found";
    return;
  }

  cityName.textContent = weather.name;
  temp.textContent = `${Math.round(weather.main.temp)}°F`;
  description.textContent = weather.weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
  humidity.textContent = `Humidity: ${weather.main.humidity}%`;
  wind.textContent = `Wind: ${Math.round(weather.wind.speed)} mph`;

  // weather.main is a word like "Clear", "Clouds" or "Rain"
  // Fog, mist, haze and anything else falls back to the clouds look
  const background = backgrounds[weather.weather[0].main] || backgrounds.Clouds;
  page.className = `min-h-screen bg-gradient-to-br ${background.colors} flex items-center justify-center p-4`;
  bgIcon.textContent = background.icon;

  const forecastData = await getForecast(city);

  // The forecast comes in 3 hour steps, so every 8th item is one day later
  forecast.innerHTML = "";
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const day = forecastData.list[i];
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });

    forecast.innerHTML += `
      <div class="bg-white/5 border border-white/40 rounded-xl p-3 text-center">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="mx-auto w-14 h-14" />
        <p>${Math.round(day.main.temp)}°F</p>
      </div>
    `;
  }
}

// Draw a button for each favorite city
function showFavorites() {
  favoritesList.innerHTML = "";

  for (const city of getFavorites()) {
    // Clicking the city name loads its weather
    const cityBtn = document.createElement("button");
    cityBtn.textContent = city;
    cityBtn.className = "bg-white/20 hover:bg-white/30 rounded-l-xl px-4 py-2";
    cityBtn.addEventListener("click", () => {
      cityInput.value = city;
      showWeather();
    });

    // Clicking the X removes the city from the list
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.className = "bg-white/10 hover:bg-red-500/60 rounded-r-xl px-3 py-2";
    removeBtn.addEventListener("click", () => {
      removeFavorite(city);
      showFavorites();
    });

    const item = document.createElement("div");
    item.className = "flex";
    item.append(cityBtn, removeBtn);
    favoritesList.append(item);
  }
}

// Save whatever city is in the search box
function saveFavorite() {
  addFavorite(cityInput.value);
  showFavorites();
}

searchBtn.addEventListener("click", showWeather);
favoriteBtn.addEventListener("click", saveFavorite);

// Load Stockton, CA and the saved favorites when the page first opens
showWeather();
showFavorites();
