const express = require('express');
const { openWeatherMap } = require('../lib/fetchData');
const validator = require('validator');
const router = express.Router();

router.get('/:city/:code?', validateParams, async (req, res, next) => {
  const { city } = req.params;
  const code = req.params.code ? `,${req.params.code}` : '';
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
    console.error(err);
    next(err.response.data);
  }
});

function validateParams(req, res, next) {
  const sanitizeInput = input =>
    validator.blacklist(
      input,
      '\\[\\]\\`\\+=\\*<>-@#\\$\\%^&()_\\-\\!|{};:\'"\\.'
    );
  req.params.city = sanitizeInput(req.params.city);
  req.params.code = sanitizeInput(req.params.code || '');
  const { city, code } = req.params;
  if (!city || (code !== '' && !validator.isISO31661Alpha2(code))) {
    throw Error('Invalid city name');
  }
  next();
}

module.exports = router;
