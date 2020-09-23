const express = require('express');
const router = express.Router();
const { timestamp, isExpired, getId } = require('../lib/helpers');
const { openWeatherMap, darkSky } = require('../lib/fetchData');
const admin = require('firebase-admin');
const database = admin.database();

// Get weatherData w params
router.get('/:lat-:lon', getWeatherData, async (req, res, next) => {
  const { lat, lon } = req.params;
  const id = getId(`${req.params.lat},${req.params.lon}`);
  if (!res.weatherData || isExpired(res.weatherData.ts)) {
    try {
      const [openRes, darkRes] = await Promise.all([
        openWeatherMap(lat, lon),
        darkSky(lat, lon)
      ]);
      // Send Response
      const response = JSON.stringify({
        ...darkRes.data,
        timezone: openRes.data.name
      });
      res.send(response);
      // Save Response
      database.ref(`requests/${id}`).set({
        locationId: id,
        loctation: openRes.data.name,
        clientId: req.query.APPID || null,
        data: response,
        ts: Number(Date.now())
      });
      // {time} Response sent to {user} {userID}
      console.log(timestamp(req));
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    res.send(res.weatherData.data);

    console.log('Cached ' + timestamp(req));
  }
);

function validateParams(req, res, next) {
  req.params.lat = sanitizeInput(req.params.lat);
  req.params.lon = sanitizeInput(req.params.lon);
  const { lat, lon } = req.params;
  if (isNaN(lat) || isNaN(lon))
    throw new Error(
      `Invalid coordinates of type ${typeof lat},${typeof lon}, expected number,number`
    );
  next();
}

// Search for stored data of requested location
// Update and return the result according to isExpired
async function getCachedData(req, res, next) {
  const id = getId(`${req.params.lat},${req.params.lon}`);
  let weatherData;
  try {
    const snapshot = await database.ref(`requests/${id}`).once('value');
    weatherData = snapshot.val();
  } catch (err) {
    return res.json({ message: err.message });
  }
  if (!isExpired(weatherData)) res.weatherData = weatherData;
  else res.weatherData = null;
  next();
}
module.exports = router;
