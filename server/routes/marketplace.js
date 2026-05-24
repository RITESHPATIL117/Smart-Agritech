const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validators');

const router = express.Router();

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('Cart cannot be empty'),
  body('items.*.productId').notEmpty().withMessage('Product id required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Invalid quantity'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address required'),
  handleValidation,
];

// GET /api/marketplace/products
router.get('/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { stock: { $gt: 0 } };
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/marketplace/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/marketplace/orders
router.post('/orders', protect, orderRules, async (req, res) => {
  try {
    const { items, shippingAddress, phone, paymentMethod } = req.body;
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
      });
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      phone: phone || req.user.phone || '',
      paymentMethod: paymentMethod || 'COD',
    });

    const populated = await Order.findById(order._id).populate('items.product');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/marketplace/orders
router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/marketplace/orders/:id
router.get('/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
