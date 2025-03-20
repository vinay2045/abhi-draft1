const mongoose = require('mongoose');

const HoneymoonBookingSchema = new mongoose.Schema({
  coupleNames: {
    type: String,
    required: [true, 'Couple names are required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  weddingDate: {
    type: Date,
  },
  destination: {
    type: String,
    required: [true, 'Preferred destination is required'],
    trim: true
  },
  otherDestination: {
    type: String,
    trim: true
  },
  travelDates: {
    type: String,
    required: [true, 'Expected travel dates are required'],
    trim: true
  },
  duration: {
    type: String,
    enum: ['3-5', '6-8', '9-12', '13+'],
    required: [true, 'Duration is required']
  },
  budget: {
    type: String,
    enum: ['below-50k', '50k-75k', '75k-100k', '100k-150k', 'above-150k'],
    required: [true, 'Budget range is required']
  },
  accommodation: {
    type: String,
    enum: ['3-star', '4-star', '5-star', 'luxury'],
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HoneymoonBooking', HoneymoonBookingSchema); 