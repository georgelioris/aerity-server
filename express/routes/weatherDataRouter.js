const express = require('express');
const router = express.Router();
const {
  timestamp,
  isExpired,
  getId,
  sanitizeInput,
  formatCache
} = require('../lib/helpers');
const { openWeatherMap, darkSky } = require('../lib/fetchData');
const admin = require('firebase-admin');
const validator = require('validator');
const database = admin.database();

// Get weatherData w params
router.get(
  '/:lat,:lon',
  validateParams,
  getCachedData,
  async (req, res, next) => {
    const { lat, lon } = req.params;
    const { location } = req.query;
    const id = getId(`${req.params.lat},${req.params.lon}`);
    if (!res.weatherData) {
      if (!location) {
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
          database
            .ref(`requests/${id}`)
            .set(formatCache(id, openRes.data.name, response));
          // {time} Response sent to {user} {userID}
          console.log(timestamp(req));
        } catch (err) {
          console.error(err);
          next(err);
        }
      } else {
        try {
          const darkRes = await darkSky(lat, lon);
          const response = JSON.stringify({
            ...darkRes.data,
            timezone: location
          });
          res.send(response);
          database
            .ref(`requests/${id}`)
            .set(formatCache(id, location, response));
        } catch (err) {
          console.error(err);
          next(err);
        }
      }
    } else {
      res.send(res.weatherData.data);

      console.log('Cached ' + timestamp(req));
    }
  }
);

function validateParams(req, res, next) {
  req.params.lat = sanitizeInput(req.params.lat);
  req.params.lon = sanitizeInput(req.params.lon);
  const { lat, lon } = req.params;
  if (!validator.isLatLong(`${lat},${lon}`))
    throw new Error('Invalid geographic coordinates');
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
