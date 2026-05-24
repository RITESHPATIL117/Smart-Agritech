const express = require('express');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Fertilizer = require('../models/Fertilizer');
const Disease = require('../models/Disease');
const Recommendation = require('../models/Recommendation');
const ContactMessage = require('../models/ContactMessage');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const cropCount = await Crop.countDocuments();
    const fertilizerCount = await Fertilizer.countDocuments();
    const diseaseCount = await Disease.countDocuments();
    const recommendationCount = await Recommendation.countDocuments();
    const contactCount = await ContactMessage.countDocuments({ status: 'new' });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const allUsers = await User.find().select('-password').sort({ createdAt: -1 });
    const recentRecommendations = await Recommendation.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const cropRecs = await Recommendation.countDocuments({ type: 'crop' });
    const fertilizerRecs = await Recommendation.countDocuments({ type: 'fertilizer' });
    const diseaseRecs = await Recommendation.countDocuments({ type: 'disease' });

    const usersByMonth = {};
    allUsers.forEach((u) => {
      const key = new Date(u.createdAt).toLocaleString('en-US', { month: 'short' });
      usersByMonth[key] = (usersByMonth[key] || 0) + 1;
    });
    const userGrowthData = Object.entries(usersByMonth).map(([month, users]) => ({
      month,
      users,
    }));

    res.json({
      stats: {
        users: userCount,
        crops: cropCount,
        fertilizers: fertilizerCount,
        diseases: diseaseCount,
        recommendations: recommendationCount,
        newMessages: contactCount,
      },
      activityBreakdown: [
        { name: 'Crop', value: cropRecs },
        { name: 'Fertilizer', value: fertilizerRecs },
        { name: 'Disease', value: diseaseRecs },
      ],
      userGrowthData,
      recentUsers,
      allUsers,
      recentRecommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/leads
// @desc    Get all user recommendations (leads) with full input & AI results
// @access  Private/Admin
router.get('/leads', protect, admin, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type && type !== 'all' ? { type } : {};

    const leads = await Recommendation.find(filter)
      .populate('user', 'name email phone location farmSize role')
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/orders
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/contacts
// @access  Private/Admin
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/admin/contacts/:id/read
router.patch('/contacts/:id/read', protect, admin, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role;
      await user.save();
      res.json({ message: 'User role updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
