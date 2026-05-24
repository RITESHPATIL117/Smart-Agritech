const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'per unit' },
  category: {
    type: String,
    enum: ['seeds', 'fertilizer', 'pesticide', 'equipment', 'tools', 'other'],
    default: 'other',
  },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: '🌾' },
  sellerName: { type: String, default: 'Agri Supply Co.' },
  location: { type: String, default: 'India' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
