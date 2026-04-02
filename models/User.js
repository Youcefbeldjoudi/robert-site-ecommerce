const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['Homme', 'Femme'], required: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String,
  },
  personalityProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalityProfile',
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);