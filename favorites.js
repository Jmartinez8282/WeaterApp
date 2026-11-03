// Favorites are saved in the browser's localStorage so they stay after a refresh.
// localStorage only stores text, so we turn the list into text with JSON.stringify
// and back into a list with JSON.parse.

// Get the saved list of cities (or an empty list the first time)
export function getFavorites() {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
}

// Add a city to the list, skipping it if it is already there
export function addFavorite(city) {
  const favorites = getFavorites();
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Remove a city from the list
export function removeFavorite(city) {
  const favorites = getFavorites().filter((favorite) => favorite !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
