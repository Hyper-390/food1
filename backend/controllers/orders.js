const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      tip
    } = req.body;

    // Calculate order totals
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions
      });
    }

    const restaurantData = await Restaurant.findById(restaurant);
    const deliveryFee = restaurantData.deliveryFee;
    const tax = totalAmount * 0.0875; // 8.75% tax
    const finalAmount = totalAmount + deliveryFee + tax + (tip || 0);

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(
      estimatedDeliveryTime.getMinutes() + 
      restaurantData.deliveryTime.max + 15 // Add 15 minutes for preparation
    );

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items: orderItems,
      deliveryAddress,
      totalAmount,
      deliveryFee,
      tax,
      tip: tip || 0,
      finalAmount,
      paymentMethod,
      estimatedDeliveryTime,
      specialInstructions
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name phone')
      .populate('items.menuItem', 'name price image')
      .populate('user', 'name phone email');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name phone address')
      .populate('items.menuItem', 'name price image description')
      .populate('deliveryPerson', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is restaurant owner/admin/delivery person
    if (order.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'restaurant' &&
        (!order.deliveryPerson || order.deliveryPerson._id.toString() !== req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Restaurant/Admin/Delivery)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, deliveryPerson } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateFields = {};

    if (orderStatus) {
      updateFields.orderStatus = orderStatus;
      
      // Set actual delivery time when delivered
      if (orderStatus === 'delivered') {
        updateFields.actualDeliveryTime = new Date();
      }
    }

    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    if (deliveryPerson) {
      updateFields.deliveryPerson = deliveryPerson;
    }

    order = await Order.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    })
    .populate('user', 'name email phone')
    .populate('restaurant', 'name phone')
    .populate('deliveryPerson', 'name phone');

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name images rating')
      .populate('items.menuItem', 'name price image')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant orders
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private (Restaurant owner/Admin)
exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name phone')
      .populate('items.menuItem', 'name price')
      .populate('deliveryPerson', 'name phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};