const express = require('express');
const router = express.Router();
const { formatUrl, timestamp } = require('../lib/helpers');
const { openWeatherMap, darkSky } = require('../lib/fetchData');
// Get weatherData
router.get('/', (req, res) => {
  res.send('Hello World');
});
// Get weatherData w params
router.get('/:lat-:lon', async (req, res, next) => {
  const { lat, lon } = req.params;
  Promise.all(openWeatherMap(lat, lon), darkSky(lat, lon))
    .then()
    .catch(err => next(err));
  // try {
  //   const response = await axios.get(url);
  //   res.send(response.data);
  //   console.log(timestamp(req));
  // } catch (err) {
  //   next(err);
  // }
});
router.post('/', (req, res) => {});

router.patch('/', (req, res) => {});

router.delete('/:id', (req, res) => {});
module.exports = router;
