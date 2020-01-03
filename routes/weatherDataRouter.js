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
  try {
    const [openRes, darkRes] = await Promise.all([
      openWeatherMap(lat, lon),
      darkSky(lat, lon)
    ]);
    res.send({ ...darkRes.data, timezone: openRes.data.name });
    // {time} Resonse sent to {user} {userID}
    console.log(timestamp(req));
  } catch (err) {
    console.error(err);
    next(err);
  }
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
