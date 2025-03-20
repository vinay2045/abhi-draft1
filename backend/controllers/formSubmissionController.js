const Contact = require('../models/Contact');
const FlightBooking = require('../models/FlightBooking');
const VisaBooking = require('../models/VisaBooking');
const HoneymoonBooking = require('../models/HoneymoonBooking');
const ForexBooking = require('../models/ForexBooking');
const TourBooking = require('../models/TourBooking');

// @desc    Submit contact form
// @route   POST /api/forms/contact
// @access  Public
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message, source } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      source: source || 'contact-page'
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit flight booking inquiry
// @route   POST /api/forms/flight
// @access  Public
exports.submitFlightBooking = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      travelClass,
      additionalInfo
    } = req.body;

    const flightBooking = await FlightBooking.create({
      name,
      email,
      phone,
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      travelClass,
      additionalInfo
    });

    res.status(201).json({
      success: true,
      data: flightBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit visa application
// @route   POST /api/forms/visa
// @access  Public
exports.submitVisaBooking = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      destination,
      visaType,
      travelDate,
      duration,
      travelers,
      message
    } = req.body;

    const visaBooking = await VisaBooking.create({
      name,
      email,
      phone,
      destination,
      visaType,
      travelDate,
      duration,
      travelers,
      message
    });

    res.status(201).json({
      success: true,
      data: visaBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit honeymoon package inquiry
// @route   POST /api/forms/honeymoon
// @access  Public
exports.submitHoneymoonBooking = async (req, res, next) => {
  try {
    const {
      coupleNames,
      email,
      phone,
      weddingDate,
      destination,
      otherDestination,
      travelDates,
      duration,
      budget,
      accommodation,
      message
    } = req.body;

    const honeymoonBooking = await HoneymoonBooking.create({
      coupleNames,
      email,
      phone,
      weddingDate,
      destination,
      otherDestination,
      travelDates,
      duration,
      budget,
      accommodation,
      message
    });

    res.status(201).json({
      success: true,
      data: honeymoonBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit forex service inquiry
// @route   POST /api/forms/forex
// @access  Public
exports.submitForexBooking = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      serviceType,
      currencyFrom,
      currencyTo,
      amount,
      travelDate,
      message
    } = req.body;

    const forexBooking = await ForexBooking.create({
      name,
      email,
      phone,
      serviceType,
      currencyFrom,
      currencyTo,
      amount,
      travelDate,
      message
    });

    res.status(201).json({
      success: true,
      data: forexBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit tour booking
// @route   POST /api/forms/tour
// @access  Public
exports.submitTourBooking = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      destination,
      travelDate,
      duration,
      travelers,
      budget,
      message,
      tourType,
      passportNumber,
      passportExpiry
    } = req.body;

    const tourBooking = await TourBooking.create({
      name,
      email,
      phone,
      destination,
      travelDate,
      duration,
      travelers,
      budget,
      message,
      tourType: tourType || 'domestic',
      passportNumber,
      passportExpiry
    });

    res.status(201).json({
      success: true,
      data: tourBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact submissions
// @route   GET /api/forms/contact
// @access  Private/Admin
exports.getContactSubmissions = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all flight booking submissions
// @route   GET /api/forms/flight
// @access  Private/Admin
exports.getFlightBookings = async (req, res, next) => {
  try {
    const flightBookings = await FlightBooking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flightBookings.length,
      data: flightBookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all visa booking submissions
// @route   GET /api/forms/visa
// @access  Private/Admin
exports.getVisaBookings = async (req, res, next) => {
  try {
    const visaBookings = await VisaBooking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visaBookings.length,
      data: visaBookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all honeymoon booking submissions
// @route   GET /api/forms/honeymoon
// @access  Private/Admin
exports.getHoneymoonBookings = async (req, res, next) => {
  try {
    const honeymoonBookings = await HoneymoonBooking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: honeymoonBookings.length,
      data: honeymoonBookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all forex booking submissions
// @route   GET /api/forms/forex
// @access  Private/Admin
exports.getForexBookings = async (req, res, next) => {
  try {
    const forexBookings = await ForexBooking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forexBookings.length,
      data: forexBookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tour booking submissions
// @route   GET /api/forms/tour
// @access  Private/Admin
exports.getTourBookings = async (req, res, next) => {
  try {
    const tourBookings = await TourBooking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tourBookings.length,
      data: tourBookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get contact submissions count
// @route   GET /api/forms/contact/count
// @access  Private/Admin
exports.getContactSubmissionsCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get flight bookings count
// @route   GET /api/forms/flight/count
// @access  Private/Admin
exports.getFlightBookingsCount = async (req, res, next) => {
  try {
    const count = await FlightBooking.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get visa bookings count
// @route   GET /api/forms/visa/count
// @access  Private/Admin
exports.getVisaBookingsCount = async (req, res, next) => {
  try {
    const count = await VisaBooking.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get honeymoon bookings count
// @route   GET /api/forms/honeymoon/count
// @access  Private/Admin
exports.getHoneymoonBookingsCount = async (req, res, next) => {
  try {
    const count = await HoneymoonBooking.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get forex bookings count
// @route   GET /api/forms/forex/count
// @access  Private/Admin
exports.getForexBookingsCount = async (req, res, next) => {
  try {
    const count = await ForexBooking.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get tour bookings count
// @route   GET /api/forms/tour/count
// @access  Private/Admin
exports.getTourBookingsCount = async (req, res, next) => {
  try {
    const count = await TourBooking.countDocuments();

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent submissions from all forms
// @route   GET /api/forms/recent
// @access  Private/Admin
exports.getRecentSubmissions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Fetch recent submissions from each model
    const contactPromise = Contact.find()
      .select('name email subject createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    const flightPromise = FlightBooking.find()
      .select('name email phone from to departureDate createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    const visaPromise = VisaBooking.find()
      .select('name email phone destination visaType travelDate createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    const honeymoonPromise = HoneymoonBooking.find()
      .select('coupleNames email phone destination travelDates createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    const forexPromise = ForexBooking.find()
      .select('name email phone serviceType currencyFrom currencyTo createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    const tourPromise = TourBooking.find()
      .select('name email phone destination travelDate createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Wait for all promises to resolve
    const [contacts, flights, visas, honeymoons, forex, tours] = await Promise.all([
      contactPromise,
      flightPromise,
      visaPromise,
      honeymoonPromise,
      forexPromise,
      tourPromise
    ]);
    
    // Transform the data to add type field
    const formattedContacts = contacts.map(item => ({
      ...item.toObject(),
      type: 'contact'
    }));
    
    const formattedFlights = flights.map(item => ({
      ...item.toObject(),
      type: 'flight'
    }));
    
    const formattedVisas = visas.map(item => ({
      ...item.toObject(),
      type: 'visa'
    }));
    
    const formattedHoneymoons = honeymoons.map(item => ({
      ...item.toObject(),
      type: 'honeymoon',
      name: item.coupleNames // Normalize the name field
    }));
    
    const formattedForex = forex.map(item => ({
      ...item.toObject(),
      type: 'forex'
    }));
    
    const formattedTours = tours.map(item => ({
      ...item.toObject(),
      type: 'tour'
    }));
    
    // Combine all submissions and sort by createdAt
    const allSubmissions = [
      ...formattedContacts,
      ...formattedFlights,
      ...formattedVisas,
      ...formattedHoneymoons,
      ...formattedForex,
      ...formattedTours
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    
    res.status(200).json({
      success: true,
      count: allSubmissions.length,
      data: allSubmissions
    });
  } catch (err) {
    next(err);
  }
}; 