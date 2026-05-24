const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Disease = require('../models/Disease');
const Recommendation = require('../models/Recommendation');
const { protect, admin } = require('../middleware/auth');
const { getGeminiVisionResponse } = require('../utils/ai');
const path = require('path');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

// @route   GET /api/diseases
// @desc    Get all diseases
// @access  Public
router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find({});
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/diseases/:id
// @desc    Get single disease
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/diseases/detect
// @desc    Upload image for disease detection
// @access  Private
router.post('/detect', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    let detectedDisease;
    let confidence;
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const prompt = `You are an expert plant pathologist. Analyze this plant leaf image and identify the disease. Return strictly a JSON object with this structure:
{
  "name": "Common Name of Disease",
  "scientificName": "Scientific Name",
  "affectedCrops": ["Crop1", "Crop2"],
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": "Main cause of the disease",
  "prevention": ["Prevention 1", "Prevention 2"],
  "treatment": "Treatment plan",
  "severity": "Low or Medium or High or Critical",
  "confidence": 85
}
Only output the JSON object.`;

      const aiResponse = await getGeminiVisionResponse(prompt, req.file.mimetype, fileBuffer);
      detectedDisease = aiResponse;
      confidence = aiResponse.confidence || 85;
      
    } catch (aiError) {
      console.error('AI Vision Detection failed:', aiError.message);
      const ref = await Disease.findOne({});
      if (!ref) {
        return res.status(503).json({
          message:
            'AI detection unavailable. Add GEMINI_API_KEY to server .env and restart, or run npm run seed.',
        });
      }
      detectedDisease = {
        name: ref.name,
        scientificName: ref.scientificName,
        affectedCrops: ref.affectedCrops,
        symptoms: ref.symptoms,
        causes: ref.causes,
        prevention: ref.prevention,
        treatment: ref.treatment,
        severity: ref.severity,
      };
      confidence = 55;
    }

    const result = {
      disease: detectedDisease,
      confidence,
      imageUrl: `/uploads/${req.file.filename}`,
      aiPowered: confidence > 60,
    };

    // Save recommendation
    const recommendation = await Recommendation.create({
      user: req.user._id,
      type: 'disease',
      inputData: { imageUrl: `/uploads/${req.file.filename}` },
      result: result,
      confidence: confidence,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/diseases
// @desc    Create new disease (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
