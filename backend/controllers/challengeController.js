const Challenge    = require('../models/Challenge');
const ChallengeLog = require('../models/ChallengeLog');

const recalcStreak = async (userId, challengeId) => {
  const logs = await ChallengeLog.find({
    user: userId, challenge: challengeId, completed: true
  }).sort({ date: 1 });

  let current = 0, longest = 0, temp = 0;
  const completed = logs.length;

  for (let i = 0; i < logs.length; i++) {
    if (i === 0) { temp = 1; }
    else {
      const diff = (new Date(logs[i].date) - new Date(logs[i-1].date)) / 86400000;
      temp = diff === 1 ? temp + 1 : 1;
    }
    if (temp > longest) longest = temp;
  }

  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const log = logs.find(l => l.date === d);
    if (log) current++;
    else if (i > 0) break;
  }

  return { current, longest, completed };
};

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.user._id });
    res.json(challenges);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({ ...req.body, user: req.user._id });
    res.status(201).json(challenge);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    res.json(challenge);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteChallenge = async (req, res) => {
  try {
    await Challenge.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    await ChallengeLog.deleteMany({ challenge: req.params.id });
    res.json({ message: 'Challenge deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await ChallengeLog.find({
      user: req.user._id, challenge: req.params.id
    }).sort({ date: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { learned, tomorrow, mood, duration } = req.body;
    const xpEarned = 10 + (duration > 30 ? 5 : 0) + (mood === 'great' ? 5 : 0);

    const log = await ChallengeLog.findOneAndUpdate(
      { user: req.user._id, challenge: req.params.id, date: today },
      { completed: true, learned, tomorrow, mood, duration, xpEarned },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const stats = await recalcStreak(req.user._id, req.params.id);
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      {
        currentStreak: stats.current,
        longestStreak: stats.longest,
        completedDays: stats.completed,
        $inc: { xp: xpEarned },
      },
      { new: true }
    );

    res.json({ log, challenge });
  } catch (err) { res.status(500).json({ message: err.message }); }
};