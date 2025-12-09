// JS file for handling frontend functions 
const form = document.getElementById("weatherForm");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("errorMessage");
const wrapper = document.querySelector(".wrapper");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cityInput = document.getElementById("city");
  const city = cityInput.value.trim();
  weatherResult.classList.add("hidden");
  errorMessage.classList.add("hidden");
  weatherResult.classList.remove("fade-in");

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  // Show loading state
  document.getElementById("location").textContent = "";
  document.getElementById("temperature").textContent = "Loading...";
  document.getElementById("description").textContent = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("wind").textContent = "";

  // Sending request to backend
  try {
    const url = `https://weather-information-proj.onrender.com/weather?city=${encodeURIComponent(city)}`;
    console.log("Fetching:", url);
    const response = await fetch(url);
    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok || data.error) {
      // Show error message
      const msg = data.error || `Could not get weather for "${city}"`;
      showError(msg);
      return;
    }

    // Apply theme based on temperature (in °C)
    const temp = parseFloat(data.temperature);
    applyTempTheme(temp);

    // Setting UI values with safe fallback
    document.getElementById("location").textContent = `${data.city ?? city} ${data.country ? ", " + data.country : ""}`;
    document.getElementById("temperature").textContent = `Temperature: ${data.temperature ?? "N/A"} °C (feels like ${data.feels_like ?? "N/A"} °C)`;
    document.getElementById("description").textContent = `Condition: ${data.description ?? "N/A"}`;
    document.getElementById("humidity").textContent = `Humidity: ${data.humidity ?? "N/A"}%`;
    document.getElementById("wind").textContent = `Wind Speed: ${data.wind_speed ?? "N/A"} m/s`;

    // Converting sunrise/sunset timestamps to readable time
    if (data.sunrise) {
      const sunrise = new Date(data.sunrise * 1000);
      document.getElementById("sunrise").textContent = `Sunrise: ${sunrise.toLocaleTimeString()}`;
    } else {
      document.getElementById("sunrise").textContent = "";
    }
    if (data.sunset) {
      const sunset = new Date(data.sunset * 1000);
      document.getElementById("sunset").textContent = `Sunset: ${sunset.toLocaleTimeString()}`;
    } else {
      document.getElementById("sunset").textContent = "";
    }

    // Weather icon handling
    const weatherIcon = document.getElementById("weatherIcon");
    if (data.icon) {
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      weatherIcon.classList.remove("hidden");
    } else {
      weatherIcon.classList.add("hidden");
    }

    weatherResult.classList.remove("hidden");
    weatherResult.classList.add("fade-in");

  } catch (err) {
    // Show network error and log error
    console.error("Fetch failed:", err);
    showError("Network error. See console for details.");
  }
});

// Error message handling
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("error-box");
  setTimeout(() => errorMessage.classList.remove("error-box"), 400);
}

// Applying Temperature-based theme class to wrapper
function applyTempTheme(temp) {
    const body = document.body;

    body.classList.remove("hot", "pleasant", "cold");

    if (temp > 30) {
        body.classList.add("hot");
    } else if (temp >= 15) {
        body.classList.add("pleasant");
    } else if (temp >= 0){
        body.classList.add("cold");
    } else {
        body.classList.add("freezing");
      }
    }
