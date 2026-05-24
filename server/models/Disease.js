const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide disease name'],
    trim: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  affectedCrops: {
    type: [String],
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  causes: {
    type: String,
    trim: true,
  },
  prevention: {
    type: [String],
    required: true,
  },
  treatment: {
    type: String,
    trim: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Disease', diseaseSchema);
