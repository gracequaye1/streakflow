const Habit = require('../models/Habit');

// Streak calculation utility
const recalcStreak = (completionHistory) => {
  const today = new Date().toISOString().split('T')[0];
  let current = 0, longest = 0, total = 0, temp = 0;

  const doneDates = Object.entries(Object.fromEntries(completionHistory))
    .filter(([, v]) => v).map(([k]) => k).sort();

  total = doneDates.length;

  // Longest streak
  for (let i = 0; i < doneDates.length; i++) {
    if (i === 0) { temp = 1; }
    else {
      const diff = (new Date(doneDates[i]) - new Date(doneDates[i-1])) / 86400000;
      temp = diff === 1 ? temp + 1 : 1;
    }
    if (temp > longest) longest = temp;
  }

  // Current streak (walk back from today)
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    if (completionHistory.get(d)) current++;
    else if (i > 0) break;
  }

  return { currentStreak: current, longestStreak: longest, totalCompleted: total };
};

// GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    res.json(habits);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, user: req.user._id });
    res.status(201).json(habit);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json(habit);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PATCH /api/habits/:id/toggle  — toggle today's completion
exports.toggleToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const current = habit.completionHistory.get(today) || false;
    habit.completionHistory.set(today, !current);

    const stats = recalcStreak(habit.completionHistory);
    habit.currentStreak = stats.currentStreak;
    habit.longestStreak = stats.longestStreak;
    habit.totalCompleted = stats.totalCompleted;

    await habit.save();
    res.json(habit);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Habit deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};