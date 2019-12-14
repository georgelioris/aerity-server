require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', e => console.log(e));
db.once('open', () =>
  console.log(`Connected to Database on ${process.env.DATABASE_URL}`)
);
app.use(express.json());
app.use(cors());
const weatherDataRouter = require('./routes/weatherDataRouter');
app.use('/weather', weatherDataRouter);
const server = app.listen(3456, () => {
  console.log(`Server running on http://localhost:${server.address().port}`);
});
