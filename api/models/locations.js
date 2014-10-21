var mongoose = require('mongoose');

var hoursOfOperationSchema = new mongoose.Schema({
  days: {
    type: String,
    required: true
  },
  opening: String,
  closing: String,
  closed: {
    type: Boolean,
    required: true
  }
});

var reviewSchema = new mongoose.Schema({
  author: {
    displayName: String
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comments: String,
  timestamp: {
    type: Date,
    "default": Date.now
  }
});

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
  geocode: {
    type: [Number],
    index: '2dsphere',
    required: true
  },
  hours: [hoursOfOperationSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location',locationSchema);