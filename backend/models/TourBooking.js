const mongoose = require('mongoose');

const TourBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  duration: {
    type: String,
    enum: ['3-5', '6-8', '9-12', '13+'],
    required: [true, 'Duration is required']
  },
  travelers: {
    type: String,
    required: [true, 'Number of travelers is required']
  },
  budget: {
    type: String,
    enum: ['below-15k', '15k-25k', '25k-35k', '35k-50k', 'above-50k'],
    required: [true, 'Budget is required']
  },
  message: {
    type: String,
    trim: true
  },
  tourType: {
    type: String,
    enum: ['domestic', 'international'],
    required: [true, 'Tour type is required']
  },
  passportNumber: {
    type: String,
    trim: true
  },
  passportExpiry: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TourBooking', TourBookingSchema); 