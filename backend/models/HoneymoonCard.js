const mongoose = require('mongoose');

const HoneymoonCardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Description text is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HoneymoonCard', HoneymoonCardSchema); 