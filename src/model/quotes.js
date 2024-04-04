const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  }
});

const selectorSchema = new mongoose.Schema({
  BaseUrl: {
    type: String,
    unique: true,
    required: true
  },
  selectorData: [quoteSchema]
});

const Quote = mongoose.model('Quote', selectorSchema);

module.exports = Quote;
