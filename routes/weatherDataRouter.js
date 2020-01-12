const express = require('express');
const router = express.Router();
const { timestamp, isExpired } = require('../lib/helpers');
const { openWeatherMap, darkSky } = require('../lib/fetchData');
const WeatherData = require('../models/weatherData');
const cuid = require('cuid');

// Get weatherData
router.get('/', (req, res) => {
  res.send('Hello World');
});
// Get weatherData w params
router.get('/:lat-:lon', getWeatherData, async (req, res, next) => {
  const { lat, lon } = req.params;
  if (!res.weatherData || res.weatherData.expired) {
    try {
      const [openRes, darkRes] = await Promise.all([
        openWeatherMap(lat, lon),
        darkSky(lat, lon)
      ]);
      // Send Response
      const response = { ...darkRes.data, timezone: openRes.data.name };
      res.send(response);
      // Save Response
      const weatherData = new WeatherData({
        _id: cuid(),
        locationId: `${lat},${lon}`,
        data: JSON.stringify(response),
        clientID: req.query.APPID,
        dataDate: Number(Date.now()),
        expired: false
      });
      weatherData.save();
      // {time} Response sent to {user} {userID}
      console.log(timestamp(req));
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    res.send(res.weatherData.data);
    console.log('Cached: ' + timestamp(req));
  }
});

async function getWeatherData(req, res, next) {
  const id = `${req.params.lat},${req.params.lon}`;
  let weatherData;
  try {
    const dataFound = await WeatherData.findOne({
      locationId: id,
      expired: false
    });
    weatherData =
      dataFound && isExpired(dataFound.dataDate)
        ? await WeatherData.findOneAndUpdate(
            { locationId: id, expired: false },
            { expired: true },
            { new: true }
          )
        : dataFound;
  } catch (err) {
    return res.json({ message: err.message });
  }

  res.weatherData = weatherData;
  next();
}

// router.post('/', (req, res) => {});

// router.patch('/', (req, res) => {});

router.delete('/delete', async (req, res) => {
  try {
    const del = await WeatherData.deleteMany({ expired: false });
    console.log(del);
    res.status(201).send('done');
  } catch (err) {
    res.status(500).json({ messagne: err.messagne });
  }
});
module.exports = router;
