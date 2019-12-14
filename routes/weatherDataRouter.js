const express = require('express');
const router = express.Router();
const axios = require('axios');
const formatUrl = require('../helpers.js');
// Get weatherData
router.get('/', (req, res) => {
  res.send('Hello World');
});
// Get weatherData w params
router.get('/:lat-:long', async (req, res, next) => {
  const query = `${req.params.lat},${req.params.long}`;
  const url = formatUrl(query);
  console.log(url);
  try {
    const response = await axios.get(url);
    res.send(response.data);
    console.log(
      new Date().toTimeString().replace(/ GMT.*/g, ''),
      'Response send to',
      req.headers.origin,
      req.query.APPID
    );
  } catch (err) {
    next(err);
  }
});
router.post('/', (req, res) => {});

router.patch('/', (req, res) => {});

router.delete('/:id', (req, res) => {});
module.exports = router;
