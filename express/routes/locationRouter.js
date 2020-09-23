const express = require('express');
const { openWeatherMap } = require('../lib/fetchData');
const { sanitizeInput } = require('../lib/helpers');
const router = express.Router();

router.get('/:city,:code', validateParams, async (req, res, next) => {
  const { city } = req.params;
  const code = `,${req.params.code || ''}`;
  try {
    const openRes = await openWeatherMap(city, code, { useCoords: false });
    const location = openRes.data.name;
    const {
      coord: { lat, lon }
    } = openRes.data;
    res.redirect(
      `/.netlify/functions/server/weather/${lat},${lon}?location=${location}`
    );
  } catch (err) {
    next(err);
    console.error(err);
  }
});

function validateParams(req, res, next) {
  req.params.city = sanitizeInput(req.params.city);
  req.params.code = sanitizeInput(req.params.code);
  const { city, code } = req.params;
  if (typeof city !== 'string' || typeof code !== 'string')
    throw new Error(
      `Invalid city name of type ${typeof city},${typeof code}, expected string,code`
    );
  next();
}

module.exports = router;
