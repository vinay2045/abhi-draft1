const express = require('express');
const router = express.Router();
const formSubmissionController = require('../controllers/formSubmissionController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes - submit forms
router.post('/contact', formSubmissionController.submitContactForm);
router.post('/flight', formSubmissionController.submitFlightBooking);
router.post('/visa', formSubmissionController.submitVisaBooking);
router.post('/honeymoon', formSubmissionController.submitHoneymoonBooking);
router.post('/forex', formSubmissionController.submitForexBooking);
router.post('/tour', formSubmissionController.submitTourBooking);

// Protected routes - get form submissions
router.get('/contact', protect, authorize, formSubmissionController.getContactSubmissions);
router.get('/flight', protect, authorize, formSubmissionController.getFlightBookings);
router.get('/visa', protect, authorize, formSubmissionController.getVisaBookings);
router.get('/honeymoon', protect, authorize, formSubmissionController.getHoneymoonBookings);
router.get('/forex', protect, authorize, formSubmissionController.getForexBookings);
router.get('/tour', protect, authorize, formSubmissionController.getTourBookings);

// Protected routes - get submission counts for dashboard
router.get('/contact/count', protect, authorize, formSubmissionController.getContactSubmissionsCount);
router.get('/flight/count', protect, authorize, formSubmissionController.getFlightBookingsCount);
router.get('/visa/count', protect, authorize, formSubmissionController.getVisaBookingsCount);
router.get('/honeymoon/count', protect, authorize, formSubmissionController.getHoneymoonBookingsCount);
router.get('/forex/count', protect, authorize, formSubmissionController.getForexBookingsCount);
router.get('/tour/count', protect, authorize, formSubmissionController.getTourBookingsCount);

// Protected route - get recent submissions for dashboard
router.get('/recent', protect, authorize, formSubmissionController.getRecentSubmissions);

module.exports = router; 