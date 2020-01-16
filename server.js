'use strict';
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const firebase = require('firebase');
// const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

// mongoose.connect(process.env.DATABASE_URL, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// });
// mongoose.set('useFindAndModify', false);
// const db = mongoose.connection;
// db.on('error', e => console.log(e));
// db.once('open', () =>
//   console.log(`Connected to Database on ${process.env.DATABASE_URL}`)
// );
const config = {
  apiKey: process.env.FIREB_KEY,
  authDomain: 'aerity-server.firebaseio.com/',
  databaseURL: 'https://aerity-server.firebaseio.com',
  projectId: 'aerity-server'
};
firebase.initializeApp(config);

// Get a reference to the database service
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cors());
// const database = firebase.database();
// (async () => {
//     try{
//       const snap = await database.ref('requests').once('value');
//       dispatch( { requests: snap.val(), type: 'SET_STATE'});
//     }
//     catch(error){
//       dispatch({isError: error});
//     }
// }
// )();
const weatherDataRouter = require('./routes/weatherDataRouter');
app.use('/weather', weatherDataRouter);
app.use('/.netlify/functions/server', weatherDataRouter);
const server = app.listen(3456, () => {
  console.log(`Server running on http://localhost:${server.address().port}`);
});

module.exports.handler = serverless(app);
