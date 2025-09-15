const express = require('express');
const {
  getReviews,
  createReview,
  getRestaurantReviews,
  getMenuItemReviews
} = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.get('/menu-item/:menuItemId', getMenuItemReviews);

module.exports = router;