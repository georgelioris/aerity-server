const axios = require('axios');

module.exports = {
  openWeatherMap: (lat, lon, API_KEY = process.env.OPNW) =>
    axios.get(`${process.env.OPNW_URL}?lat=${lat}&lon=${lon}&APPID=${API_KEY}`),
  darkSky: (lat, lon, opts = '?units=auto', API_KEY = process.env.DARK) =>
    axios.get(`${process.env.DARK_URL}/${API_KEY}/${lat},${lon}${opts}`)
};
