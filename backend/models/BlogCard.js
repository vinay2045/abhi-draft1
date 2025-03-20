const mongoose = require('mongoose');

const BlogCardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
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
  size: {
    type: String,
    enum: ['large', 'small'],
    default: 'small'
  },
  page: {
    type: String,
    required: [true, 'Page is required'],
    trim: true
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

module.exports = mongoose.model('BlogCard', BlogCardSchema); 