const mongoose = require('mongoose');

const FlightBookingSchema = new mongoose.Schema({
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
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip', 'multi-city'],
    required: [true, 'Trip type is required']
  },
  from: {
    type: String,
    required: [true, 'Departure location is required'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureDate: {
    type: Date,
    required: [true, 'Departure date is required']
  },
  returnDate: {
    type: Date
  },
  passengers: {
    type: String,
    required: [true, 'Number of passengers is required']
  },
  travelClass: {
    type: String,
    enum: ['economy', 'premium-economy', 'business', 'first'],
    required: [true, 'Travel class is required']
  },
  additionalInfo: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FlightBooking', FlightBookingSchema); 