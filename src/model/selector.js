const mongoose = require('mongoose');

const scrapedDataSchema = new mongoose.Schema({
  url: String,
  isChecked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const baseSchema = new mongoose.Schema({
  BASE_URL: {
    type: String,
    unique: true
  },
  scrapedData: [scrapedDataSchema]
});

const Base = mongoose.model('Base', baseSchema);

module.exports = Base;
