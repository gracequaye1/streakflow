const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day:       { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  subject:   { type: String, required: true },
  lecturer:  { type: String, default: '' },
  notes:     { type: String, default: '' },
  color:     { type: String, default: '#6366f1' },
}, { _id: true });

const timetableSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:  { type: String, enum: ['school', 'personal'], required: true },
  title: { type: String, default: 'My Timetable' },
  slots: [slotSchema],
  activeDays: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);