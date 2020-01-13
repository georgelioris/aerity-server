const { Schema, model } = require('mongoose');

const weatherDataSchema = new Schema({
  _id: {
    type: String,
    requred: true
  },
  locationId: {
    type: String,
    requred: true
  },
  data: {
    type: String,
    required: true
  },
  clientID: {
    type: String,
    required: true
  },
  ts: {
    type: Number,
    requred: true,
    default: Date.now()
  },
  expired: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = model('savedData', weatherDataSchema);
