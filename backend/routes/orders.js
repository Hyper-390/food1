const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  getRestaurantOrders
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, createOrder);

router.get('/user', protect, getUserOrders);
router.get('/restaurant/:restaurantId', protect, authorize('restaurant', 'admin'), getRestaurantOrders);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrderStatus);

module.exports = router;