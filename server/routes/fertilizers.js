const express = require('express');
const Fertilizer = require('../models/Fertilizer');
const Recommendation = require('../models/Recommendation');
const { protect, admin } = require('../middleware/auth');
const { fertilizerRecommendRules } = require('../middleware/validators');
const { getGeminiResponse } = require('../utils/ai');

const router = express.Router();

// @route   GET /api/fertilizers
// @desc    Get all fertilizers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const fertilizers = await Fertilizer.find({});
    res.json(fertilizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fertilizers/:id
// @desc    Get single fertilizer
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findById(req.params.id);
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.json(fertilizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fertilizers/recommend
// @desc    Get fertilizer recommendation based on crop and soil
// @access  Private
router.post('/recommend', protect, fertilizerRecommendRules, async (req, res) => {
  try {
    const { cropName, soilType, nitrogen, phosphorus, potassium } = req.body;

    const prompt = `You are an expert agricultural scientist. Based on the following inputs:
Crop Name: ${cropName}
Soil Type: ${soilType}
Nitrogen (N) level: ${nitrogen}
Phosphorus (P) level: ${phosphorus}
Potassium (K) level: ${potassium}

Recommend the top 3 best fertilizers for these conditions. Return the response strictly as a JSON array of objects with the following keys:
{
  "name": "Fertilizer Name",
  "type": "Organic or Chemical",
  "nitrogen": 0,
  "phosphorus": 0,
  "potassium": 0,
  "dosage": "Suggested Dosage per hectare",
  "applicationMethod": "Method of application",
  "timing": "When to apply"
}
Only output the JSON array, nothing else.`;

    let recommendations = [];
    try {
      recommendations = await getGeminiResponse(prompt, "You are a professional agricultural AI assistant. Always output valid JSON arrays.");
    } catch (aiError) {
      console.error("AI Recommendation failed, falling back to empty array", aiError);
      recommendations = [];
    }

    // Save recommendation
    const recommendation = await Recommendation.create({
      user: req.user._id,
      type: 'fertilizer',
      inputData: { cropName, soilType, nitrogen, phosphorus, potassium },
      result: recommendations,
      confidence: recommendations.length > 0 ? 75 : 0,
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fertilizers
// @desc    Create new fertilizer (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const fertilizer = await Fertilizer.create(req.body);
    res.status(201).json(fertilizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
