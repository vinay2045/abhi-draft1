const CarouselItem = require('../models/CarouselItem');
const BlogCard = require('../models/BlogCard');
const HeroSection = require('../models/HeroSection');
const TourCard = require('../models/TourCard');
const HoneymoonCard = require('../models/HoneymoonCard');
const path = require('path');
const fs = require('fs');

// Helper function to process file uploads
const processImageUpload = (req) => {
  if (!req.file) return null;
  
  // Create relative path for the image
  return `../images/${req.file.filename}`;
};

// @desc    Get all carousel items
// @route   GET /api/content/carousel
// @access  Public
exports.getCarouselItems = async (req, res, next) => {
  try {
    const carouselItems = await CarouselItem.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: carouselItems.length,
      data: carouselItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create carousel item
// @route   POST /api/content/carousel
// @access  Private/Admin
exports.createCarouselItem = async (req, res, next) => {
  try {
    const { title, heading, subheading, tags } = req.body;
    
    // Process uploaded image
    const image = processImageUpload(req);
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Convert tags string to array if needed
    let tagArray = tags;
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim());
    }
    
    const carouselItem = await CarouselItem.create({
      image,
      title,
      heading,
      subheading,
      tags: tagArray,
      // Get the highest order number and add 1
      order: (await CarouselItem.countDocuments()) + 1
    });

    res.status(201).json({
      success: true,
      data: carouselItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update carousel item
// @route   PUT /api/content/carousel/:id
// @access  Private/Admin
exports.updateCarouselItem = async (req, res, next) => {
  try {
    const { title, heading, subheading, tags, order } = req.body;
    let carouselItem = await CarouselItem.findById(req.params.id);

    if (!carouselItem) {
      return res.status(404).json({
        success: false,
        message: 'Carousel item not found'
      });
    }

    // Process uploaded image
    let image = carouselItem.image;
    if (req.file) {
      image = processImageUpload(req);
    }

    // Convert tags string to array if needed
    let tagArray = tags;
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim());
    }

    carouselItem = await CarouselItem.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        heading,
        subheading,
        tags: tagArray,
        order: order || carouselItem.order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: carouselItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete carousel item
// @route   DELETE /api/content/carousel/:id
// @access  Private/Admin
exports.deleteCarouselItem = async (req, res, next) => {
  try {
    const carouselItem = await CarouselItem.findById(req.params.id);

    if (!carouselItem) {
      return res.status(404).json({
        success: false,
        message: 'Carousel item not found'
      });
    }

    await carouselItem.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all blog cards
// @route   GET /api/content/blog
// @access  Public
exports.getBlogCards = async (req, res, next) => {
  try {
    const blogCards = await BlogCard.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: blogCards.length,
      data: blogCards
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create blog card
// @route   POST /api/content/blog
// @access  Private/Admin
exports.createBlogCard = async (req, res, next) => {
  try {
    const { title, tags, size, page } = req.body;
    
    // Process uploaded image
    const image = processImageUpload(req);
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Convert tags string to array if needed
    let tagArray = tags;
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim());
    }
    
    const blogCard = await BlogCard.create({
      image,
      title,
      tags: tagArray,
      size: size || 'small',
      page,
      // Get the highest order number and add 1
      order: (await BlogCard.countDocuments()) + 1
    });

    res.status(201).json({
      success: true,
      data: blogCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update blog card
// @route   PUT /api/content/blog/:id
// @access  Private/Admin
exports.updateBlogCard = async (req, res, next) => {
  try {
    const { title, tags, size, order, page } = req.body;
    let blogCard = await BlogCard.findById(req.params.id);

    if (!blogCard) {
      return res.status(404).json({
        success: false,
        message: 'Blog card not found'
      });
    }

    // Process uploaded image
    let image = blogCard.image;
    if (req.file) {
      image = processImageUpload(req);
    }

    // Convert tags string to array if needed
    let tagArray = tags;
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim());
    }

    blogCard = await BlogCard.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        tags: tagArray,
        size: size || blogCard.size,
        page: page || blogCard.page,
        order: order || blogCard.order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: blogCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete blog card
// @route   DELETE /api/content/blog/:id
// @access  Private/Admin
exports.deleteBlogCard = async (req, res, next) => {
  try {
    const blogCard = await BlogCard.findById(req.params.id);

    if (!blogCard) {
      return res.status(404).json({
        success: false,
        message: 'Blog card not found'
      });
    }

    await blogCard.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get hero section by page
// @route   GET /api/content/hero/:page
// @access  Public
exports.getHeroSection = async (req, res, next) => {
  try {
    const heroSection = await HeroSection.findOne({ page: req.params.page });

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found for this page'
      });
    }

    res.status(200).json({
      success: true,
      data: heroSection
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or Update hero section
// @route   PUT /api/content/hero/:page
// @access  Private/Admin
exports.updateHeroSection = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const page = req.params.page;
    
    let heroSection = await HeroSection.findOne({ page });
    let image;

    if (req.file) {
      image = processImageUpload(req);
    } else if (heroSection) {
      image = heroSection.image;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // If hero section exists, update it, otherwise create new
    if (heroSection) {
      heroSection = await HeroSection.findOneAndUpdate(
        { page },
        {
          image,
          title,
          description,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
    } else {
      heroSection = await HeroSection.create({
        page,
        image,
        title,
        description
      });
    }

    res.status(200).json({
      success: true,
      data: heroSection
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tour cards by type
// @route   GET /api/content/tour/:type
// @access  Public
exports.getTourCards = async (req, res, next) => {
  try {
    const tourType = req.params.type;
    const tourCards = await TourCard.find({ tourType }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: tourCards.length,
      data: tourCards
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create tour card
// @route   POST /api/content/tour
// @access  Private/Admin
exports.createTourCard = async (req, res, next) => {
  try {
    const { title, text, price, duration, category, tourType } = req.body;
    
    // Process uploaded image
    const image = processImageUpload(req);
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }
    
    const tourCard = await TourCard.create({
      image,
      title,
      text,
      price,
      duration,
      category,
      tourType,
      // Get the highest order number and add 1
      order: (await TourCard.countDocuments({ tourType })) + 1
    });

    res.status(201).json({
      success: true,
      data: tourCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update tour card
// @route   PUT /api/content/tour/:id
// @access  Private/Admin
exports.updateTourCard = async (req, res, next) => {
  try {
    const { title, text, price, duration, category, tourType, order } = req.body;
    let tourCard = await TourCard.findById(req.params.id);

    if (!tourCard) {
      return res.status(404).json({
        success: false,
        message: 'Tour card not found'
      });
    }

    // Process uploaded image
    let image = tourCard.image;
    if (req.file) {
      image = processImageUpload(req);
    }

    tourCard = await TourCard.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        text,
        price,
        duration,
        category,
        tourType: tourType || tourCard.tourType,
        order: order || tourCard.order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: tourCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete tour card
// @route   DELETE /api/content/tour/:id
// @access  Private/Admin
exports.deleteTourCard = async (req, res, next) => {
  try {
    const tourCard = await TourCard.findById(req.params.id);

    if (!tourCard) {
      return res.status(404).json({
        success: false,
        message: 'Tour card not found'
      });
    }

    await tourCard.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all honeymoon cards
// @route   GET /api/content/honeymoon
// @access  Public
exports.getHoneymoonCards = async (req, res, next) => {
  try {
    const honeymoonCards = await HoneymoonCard.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: honeymoonCards.length,
      data: honeymoonCards
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create honeymoon card
// @route   POST /api/content/honeymoon
// @access  Private/Admin
exports.createHoneymoonCard = async (req, res, next) => {
  try {
    const { title, text, price, duration, location } = req.body;
    
    // Process uploaded image
    const image = processImageUpload(req);
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }
    
    const honeymoonCard = await HoneymoonCard.create({
      image,
      title,
      text,
      price,
      duration,
      location,
      // Get the highest order number and add 1
      order: (await HoneymoonCard.countDocuments()) + 1
    });

    res.status(201).json({
      success: true,
      data: honeymoonCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update honeymoon card
// @route   PUT /api/content/honeymoon/:id
// @access  Private/Admin
exports.updateHoneymoonCard = async (req, res, next) => {
  try {
    const { title, text, price, duration, location, order } = req.body;
    let honeymoonCard = await HoneymoonCard.findById(req.params.id);

    if (!honeymoonCard) {
      return res.status(404).json({
        success: false,
        message: 'Honeymoon card not found'
      });
    }

    // Process uploaded image
    let image = honeymoonCard.image;
    if (req.file) {
      image = processImageUpload(req);
    }

    honeymoonCard = await HoneymoonCard.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        text,
        price,
        duration,
        location,
        order: order || honeymoonCard.order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: honeymoonCard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete honeymoon card
// @route   DELETE /api/content/honeymoon/:id
// @access  Private/Admin
exports.deleteHoneymoonCard = async (req, res, next) => {
  try {
    const honeymoonCard = await HoneymoonCard.findById(req.params.id);

    if (!honeymoonCard) {
      return res.status(404).json({
        success: false,
        message: 'Honeymoon card not found'
      });
    }

    await honeymoonCard.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 