const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: String,
  styleTags: [String], // Tags for matching with personality
  stock: { type: Number, default: 0 },
  compatibilityScore: { type: Number, default: 0 }, // Calculated based on user profile
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);