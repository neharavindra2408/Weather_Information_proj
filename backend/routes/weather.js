// File to send and receive request & response from OpenWeather API
const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.WEATHER_API_KEY;

// Getting city name from frontend as query
router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City name is required" });

  // Sending city name request to OpenWeather API for response
  try {
    const resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    const data = resp.data;

    // Building a clear response payload
    const payload = {
      city: data.name,
      country: data.sys?.country,
      temperature: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      pressure: data.main?.pressure,
      wind_speed: data.wind?.speed,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      sunrise: data.sys?.sunrise,
      sunset: data.sys?.sunset
    };

    res.json(payload);

  } catch (error) {
    // Error log for debugging
    console.error("Weather route error:", error.response?.data || error.message || error);
    // If OpenWeather returned an error message, forward it to frontend
    if (error.response?.data?.message) {
      return res.status(error.response.status || 400).json({ error: error.response.data.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
