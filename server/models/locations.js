var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    "default": 0
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'
  }
});