const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/weather/forecast/:city
// @desc    Get 5-day weather forecast (must be before /:city)
// @access  Private
router.get('/forecast/:city', protect, async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'OpenWeather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecastData = response.data.list.map((item) => ({
      dateTime: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json(forecastData.slice(0, 8));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'City not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// @route   GET /api/weather/:city
// @desc    Get weather data for a city
// @access  Private
router.get('/:city', protect, async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'OpenWeather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };

    res.json(weatherData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'City not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
