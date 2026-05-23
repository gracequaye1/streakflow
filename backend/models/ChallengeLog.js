const mongoose = require('mongoose');

const challengeLogSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge:   { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  date:        { type: String, required: true },
  completed:   { type: Boolean, default: false },
  learned:     { type: String, default: '' },
  tomorrow:    { type: String, default: '' },
  mood:        { type: String, enum: ['great', 'good', 'okay', 'hard'], default: 'good' },
  duration:    { type: Number, default: 0 },
  xpEarned:   { type: Number, default: 0 },
}, { timestamps: true });

challengeLogSchema.index({ user: 1, challenge: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeLog', challengeLogSchema);