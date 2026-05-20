const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  time:      { type: String, required: true },   // "HH:MM"
  color:     { type: String, default: '#6366f1' },
  done:      { type: Boolean, default: false },
  recurring: { type: Boolean, default: false },  // repeats daily
}, { timestamps: true });

const scheduleSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['personal', 'work', 'freetime'], required: true },
  tasks:    [taskSchema],
}, { timestamps: true });

// One document per user per type
scheduleSchema.index({ user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);