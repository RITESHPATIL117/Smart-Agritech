const express = require('express');
const Crop = require('../models/Crop');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const { cropRecommendRules } = require('../middleware/validators');
const { getGeminiResponse } = require('../utils/ai');

const router = express.Router();

// @route   GET /api/crops
// @desc    Get all crops
// @access  Public
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find({});
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/crops/:id
// @desc    Get single crop
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/crops/recommend
// @desc    Get crop recommendation based on conditions
// @access  Private
router.post('/recommend', protect, cropRecommendRules, async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;

    const prompt = `You are an expert agronomist. Based on the following soil and weather conditions:
Nitrogen: ${nitrogen}
Phosphorus: ${phosphorus}
Potassium: ${potassium}
Temperature: ${temperature}°C
Humidity: ${humidity}%
pH Level: ${ph}
Rainfall: ${rainfall}mm

Recommend the top 3 most suitable crops for these conditions. Return the response as a JSON array of objects. Each object MUST strictly have this structure:
{
  "name": "Crop Name",
  "season": "Best Season",
  "temperature": { "min": 0, "max": 0 },
  "ph": { "min": 0, "max": 0 },
  "rainfall": { "min": 0, "max": 0 },
  "yield": "Expected Yield per hectare"
}
Only output the JSON array, nothing else.`;

    let recommendations = [];
    try {
      recommendations = await getGeminiResponse(prompt, "You are a professional agricultural AI assistant. Always output valid JSON arrays.");
    } catch (aiError) {
      console.error("AI Recommendation failed, falling back to basic algo", aiError);
      // fallback basic logic here if needed...
      recommendations = [];
    }

    // Save recommendation
    const recommendation = await Recommendation.create({
      user: req.user._id,
      type: 'crop',
      inputData: { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall },
      result: recommendations,
      confidence: recommendations.length > 0 ? 80 : 0,
    });

    // Add to user's recommendations
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recommendations: recommendation._id },
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/crops
// @desc    Create new crop (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
