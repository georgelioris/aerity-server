const axios = require('axios');

module.exports = {
  openWeatherMap: (lat, lon, owmKey = process.env.OPNW) =>
    axios.get(
      `https://api.openweathermap.org/data/2.5/weatherlat=${lat}&lon=${lon}&appid=${owmKey}`
    ),
  darkSky: (lat, lon, opts = '?units=auto', owmKey = process.env.DARK) =>
    axios.get(`https://api.darksky.net/forecast/${owmKey}/${lat},${lon}${opts}`)
};
