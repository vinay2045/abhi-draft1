const mongoose = require('mongoose');

const ForexBookingSchema = new mongoose.Schema({
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
  serviceType: {
    type: String,
    enum: ['currency-exchange', 'travel-card', 'wire-transfer', 'travel-insurance', 'other'],
    required: [true, 'Service type is required']
  },
  currencyFrom: {
    type: String,
    required: [true, 'From currency is required'],
    trim: true
  },
  currencyTo: {
    type: String,
    required: [true, 'To currency is required'],
    trim: true
  },
  amount: {
    type: String,
    trim: true
  },
  travelDate: {
    type: Date
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

module.exports = mongoose.model('ForexBooking', ForexBookingSchema); 