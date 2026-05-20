const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
  date:      { type: String, required: true },  // "YYYY-MM-DD"
  completed: { type: Boolean, default: false },
}, { _id: false });

const habitSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  icon:        { type: String, default: '⭐' },
  category:    { type: String, default: 'General' },
  description: { type: String, default: '' },
  color:       { type: String, default: '#6366f1' },
  reminder:    { type: Boolean, default: false },
  reminderTime:{ type: String, default: '08:00' },

  // Streak tracking
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompleted:{ type: Number, default: 0 },

  // Daily completion history: { "2025-05-14": true, ... }
  completionHistory: { type: Map, of: Boolean, default: {} },

  isArchived:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
