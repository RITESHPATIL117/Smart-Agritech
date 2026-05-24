const express = require('express');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/public/stats
// @desc    Public platform stats for landing page
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [users, recommendations, products] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      Recommendation.countDocuments(),
      Product.countDocuments(),
    ]);
    res.json({
      farmers: users,
      recommendations,
      products,
      modules: 6,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
