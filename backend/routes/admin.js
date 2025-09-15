const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  approveRestaurant,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/approve', approveRestaurant);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;