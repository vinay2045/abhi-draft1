const mongoose = require('mongoose');

const VisaBookingSchema = new mongoose.Schema({
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
    required: [true, 'Destination country is required'],
    trim: true
  },
  visaType: {
    type: String,
    enum: ['tourist', 'business', 'student', 'work', 'transit', 'medical', 'other'],
    required: [true, 'Visa type is required']
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  duration: {
    type: String,
    enum: ['less-than-7', '7-14', '15-30', '1-3-months', '3-6-months', 'more-than-6'],
    required: [true, 'Duration of stay is required']
  },
  travelers: {
    type: String,
    required: [true, 'Number of travelers is required']
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

module.exports = mongoose.model('VisaBooking', VisaBookingSchema); 