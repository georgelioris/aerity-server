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
    const { location, timezone } = req.query;
    const id = getId(`${req.params.lat},${req.params.lon}`);
    if (!res.weatherData) {
      if (!location || !timezone) {
        try {
          const [openRes, darkRes] = await Promise.all([
            openWeatherMap(lat, lon),
            darkSky(lat, lon)
          ]);
          // Send Response
          const response = JSON.stringify({
            ...darkRes.data,
            timezone: openRes.data.timezone,
            location: openRes.data.name
          });
          res.set({
            'Cache-Control': 'public, must-revalidate',
            Expires: new Date(Date.now() + 300000).toUTCString()
          });
          res.send(response);
          // Save Response
          database.ref(`requests/${id}`).set(formatCache(id, response));
          // {time} Response sent to {address}
          console.log(timestamp(req));
        } catch (err) {
          console.error(err);
          next(err.response.data);
        }
      } else {
        try {
          const darkRes = await darkSky(lat, lon);
          const response = JSON.stringify({
            ...darkRes.data,
            timezone: Number(timezone),
            location
          });
          res.set({
            'Cache-Control': 'public, must-revalidate',
            Expires: new Date(Date.now() + 300000).toUTCString()
          });
          res.send(response);
          database.ref(`requests/${id}`).set(formatCache(location, response));
        } catch (err) {
          console.error(err);
          next(err.response.data);
        }
      }
    } else {
      res.set({
        'Cache-Control': 'public, must-revalidate',
        Expires: res.weatherData.expires
      });
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
  try {
    const snapshot = await database.ref(`requests/${id}`).once('value');
    const weatherData = snapshot.val();

    if (weatherData && !isExpired(weatherData.ts))
      res.weatherData = weatherData;
    else res.weatherData = null;
  } catch (err) {
    next(err);
  }
  next();
}
module.exports = router;
