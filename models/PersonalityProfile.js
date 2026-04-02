const mongoose = require('mongoose');

const personalityProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  styleType: { type: String, required: true }, // e.g., 'Casual', 'Elegant', 'Sporty', etc.
  preferences: {
    colors: [String],
    styles: [String],
    lifestyle: String,
  },
  quizAnswers: [{ question: String, answer: String }],
}, { timestamps: true });

module.exports = mongoose.model('PersonalityProfile', personalityProfileSchema);