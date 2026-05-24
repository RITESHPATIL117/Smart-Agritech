const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'All Season'],
    required: true,
  },
  soilType: {
    type: [String],
    required: true,
  },
  temperature: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  rainfall: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  humidity: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  ph: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  nitrogen: {
    min: Number,
    max: Number,
  },
  phosphorus: {
    min: Number,
    max: Number,
  },
  potassium: {
    min: Number,
    max: Number,
  },
  growingPeriod: {
    type: Number,
    required: true,
  },
  yield: {
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

module.exports = mongoose.model('Crop', cropSchema);
