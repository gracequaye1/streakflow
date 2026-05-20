const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:         { type: String, required: true }, // "YYYY-MM-DD"
  achievements: { type: String, default: '' },
  feelings:     { type: String, default: '' },
  struggles:    { type: String, default: '' },
  notes:        { type: String, default: '' },
  mood:         { type: String, enum: ['happy', 'neutral', 'sad'], default: 'neutral' },
  linkedHabits: [{ type: String }], // habit names
}, { timestamps: true });

// One reflection per user per day
reflectionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Reflection', reflectionSchema);