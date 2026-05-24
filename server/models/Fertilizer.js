const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide fertilizer name'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Organic', 'Chemical', 'Bio-fertilizer'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  nitrogen: {
    type: Number,
    required: true,
  },
  phosphorus: {
    type: Number,
    required: true,
  },
  potassium: {
    type: Number,
    required: true,
  },
  suitableCrops: {
    type: [String],
    required: true,
  },
  applicationMethod: {
    type: String,
    trim: true,
  },
  dosage: {
    type: String,
    trim: true,
  },
  timing: {
    type: String,
    trim: true,
  },
  precautions: {
    type: String,
    trim: true,
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

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
