const mongoose = require('mongoose');

const HeroSectionSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  page: {
    type: String,
    required: [true, 'Page is required'],
    trim: true,
    unique: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HeroSection', HeroSectionSchema); 