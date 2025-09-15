const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantMenu
} = require('../controllers/menu');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('restaurant', 'admin'), createMenuItem);

router.get('/restaurant/:restaurantId', getRestaurantMenu);

router.route('/:id')
  .get(getMenuItem)
  .put(protect, authorize('restaurant', 'admin'), updateMenuItem)
  .delete(protect, authorize('restaurant', 'admin'), deleteMenuItem);

module.exports = router;