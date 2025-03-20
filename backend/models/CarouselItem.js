const mongoose = require('mongoose');

const CarouselItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    trim: true
  },
  subheading: {
    type: String,
    required: [true, 'Subheading is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
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

module.exports = mongoose.model('CarouselItem', CarouselItemSchema); 