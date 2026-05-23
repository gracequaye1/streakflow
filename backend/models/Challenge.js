const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, default: 'Coding' },
  totalDays:   { type: Number, required: true },
  startDate:   { type: String, required: true },
  reminderTimes: [{ type: String }],
  color:       { type: String, default: '#6366f1' },
  icon:        { type: String, default: 'target' },
  status:      { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  currentStreak:  { type: Number, default: 0 },
  longestStreak:  { type: Number, default: 0 },
  completedDays:  { type: Number, default: 0 },
  xp:             { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);