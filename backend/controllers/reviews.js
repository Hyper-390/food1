const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate('user', 'name avatar')
      .populate('restaurant', 'name')
      .populate('menuItem', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { restaurant, menuItem, order, rating, comment } = req.body;

    // Verify order exists and belongs to user
    const orderExists = await Order.findOne({
      _id: order,
      user: req.user.id,
      orderStatus: 'delivered'
    });

    if (!orderExists) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    // Check if user already reviewed this order
    const existingReview = await Review.findOne({
      user: req.user.id,
      order: order
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this order'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant,
      menuItem,
      order,
      rating,
      comment
    });

    // Update restaurant rating
    if (restaurant) {
      await updateRestaurantRating(restaurant);
    }

    // Update menu item rating
    if (menuItem) {
      await updateMenuItemRating(menuItem);
    }

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('restaurant', 'name')
      .populate('menuItem', 'name');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant reviews
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
exports.getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
      isApproved: true
    })
    .populate('user', 'name avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get menu item reviews
// @route   GET /api/reviews/menu-item/:menuItemId
// @access  Public
exports.getMenuItemReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      menuItem: req.params.menuItemId,
      isApproved: true
    })
    .populate('user', 'name avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update restaurant rating
const updateRestaurantRating = async (restaurantId) => {
  const reviews = await Review.find({ restaurant: restaurantId });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avgRating,
      totalReviews: reviews.length
    });
  }
};

// Helper function to update menu item rating
const updateMenuItemRating = async (menuItemId) => {
  const reviews = await Review.find({ menuItem: menuItemId });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    
    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: avgRating,
      totalReviews: reviews.length
    });
  }
};