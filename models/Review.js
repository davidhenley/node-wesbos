const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store'
  },
  text: {
    type: String,
    required: 'You must supply text!'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model('Review', reviewSchema);
