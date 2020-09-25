'use strict';
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const admin = require('firebase-admin');
const serviceAccount = process.env.FIREBASE_CONFIG;
const config = {
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: 'https://aerity-server.firebaseio.com'
};
admin.initializeApp(config);

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cors());
const weatherDataRouter = require('./routes/weatherDataRouter');
const locationRouter = require('./routes/locationRouter');
app.use('/.netlify/functions/server/weather', weatherDataRouter);
app.use('/.netlify/functions/server/location', locationRouter);
app.use((err, req, res, next) => {
  if (req.xhr) {
    res.status(err.cod || 500).send(err.message);
  } else {
    next(err);
  }
});

module.exports.handler = serverless(app);
