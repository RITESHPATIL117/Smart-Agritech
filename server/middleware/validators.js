const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  handleValidation,
];

const cropRecommendRules = [
  body('nitrogen').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Nitrogen must be 0–200'),
  body('phosphorus').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Phosphorus must be 0–200'),
  body('potassium').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Potassium must be 0–200'),
  body('temperature').toFloat().isFloat({ min: -10, max: 55 }).withMessage('Temperature must be -10 to 55°C'),
  body('humidity').toFloat().isFloat({ min: 0, max: 100 }).withMessage('Humidity must be 0–100%'),
  body('ph').toFloat().isFloat({ min: 0, max: 14 }).withMessage('pH must be 0–14'),
  body('rainfall').toFloat().isFloat({ min: 0, max: 500 }).withMessage('Rainfall must be 0–500mm'),
  handleValidation,
];

const fertilizerRecommendRules = [
  body('cropName').trim().notEmpty().withMessage('Crop name is required'),
  body('soilType').trim().notEmpty().withMessage('Soil type is required'),
  body('nitrogen').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Nitrogen must be 0–200'),
  body('phosphorus').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Phosphorus must be 0–200'),
  body('potassium').toFloat().isFloat({ min: 0, max: 200 }).withMessage('Potassium must be 0–200'),
  handleValidation,
];

module.exports = {
  handleValidation,
  registerRules,
  loginRules,
  contactRules,
  cropRecommendRules,
  fertilizerRecommendRules,
};
