const express = require('express');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/history
// @desc    Get user recommendation history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const recommendations = await Recommendation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
