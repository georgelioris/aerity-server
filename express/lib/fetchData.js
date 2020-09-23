const axios = require('axios');

module.exports = {
  openWeatherMap: (
    param1,
    param2,
    { useCoords } = { useCoords: true },
    API_KEY = process.env.OPNW
  ) => {
    const url = useCoords
      ? `${process.env.OPNW_URL}?lat=${param1}&lon=${param2}&APPID=${API_KEY}`
      : `${process.env.OPNW_URL}?q=${param1}${param2}&APPID=${API_KEY}`;
    return axios.get(url);
  },
  darkSky: (lat, lon, opts = '?units=auto', API_KEY = process.env.DARK) =>
    axios.get(`${process.env.DARK_URL}/${API_KEY}/${lat},${lon}${opts}`)
};
