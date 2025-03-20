const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');

// Carousel routes
router.get('/carousel', contentController.getCarouselItems);
router.post('/carousel', protect, authorize, upload.single('image'), contentController.createCarouselItem);
router.put('/carousel/:id', protect, authorize, upload.single('image'), contentController.updateCarouselItem);
router.delete('/carousel/:id', protect, authorize, contentController.deleteCarouselItem);

// Blog card routes
router.get('/blog', contentController.getBlogCards);
router.post('/blog', protect, authorize, upload.single('image'), contentController.createBlogCard);
router.put('/blog/:id', protect, authorize, upload.single('image'), contentController.updateBlogCard);
router.delete('/blog/:id', protect, authorize, contentController.deleteBlogCard);

// Hero section routes
router.get('/hero/:page', contentController.getHeroSection);
router.put('/hero/:page', protect, authorize, upload.single('image'), contentController.updateHeroSection);

// Tour card routes
router.get('/tour/:type', contentController.getTourCards);
router.post('/tour', protect, authorize, upload.single('image'), contentController.createTourCard);
router.put('/tour/:id', protect, authorize, upload.single('image'), contentController.updateTourCard);
router.delete('/tour/:id', protect, authorize, contentController.deleteTourCard);

// Honeymoon card routes
router.get('/honeymoon', contentController.getHoneymoonCards);
router.post('/honeymoon', protect, authorize, upload.single('image'), contentController.createHoneymoonCard);
router.put('/honeymoon/:id', protect, authorize, upload.single('image'), contentController.updateHoneymoonCard);
router.delete('/honeymoon/:id', protect, authorize, contentController.deleteHoneymoonCard);

module.exports = router; 