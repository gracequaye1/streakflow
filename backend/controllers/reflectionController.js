const Reflection = require('../models/Reflection');

// GET /api/reflections — all reflections for user
exports.getAll = async (req, res) => {
  try {
    const reflections = await Reflection.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(reflections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reflections/:date — get one day
exports.getByDate = async (req, res) => {
  try {
    const reflection = await Reflection.findOne({
      user: req.user._id,
      date: req.params.date
    });
    if (!reflection) return res.status(404).json({ message: 'No reflection found' });
    res.json(reflection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reflections — create or update today's reflection
exports.upsert = async (req, res) => {
  const { date, achievements, feelings, struggles, notes, mood, linkedHabits } = req.body;
  try {
    const reflection = await Reflection.findOneAndUpdate(
      { user: req.user._id, date },
      { achievements, feelings, struggles, notes, mood, linkedHabits },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(reflection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/reflections/:date — update specific day
exports.update = async (req, res) => {
  try {
    const reflection = await Reflection.findOneAndUpdate(
      { user: req.user._id, date: req.params.date },
      req.body,
      { new: true }
    );
    if (!reflection) return res.status(404).json({ message: 'Reflection not found' });
    res.json(reflection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reflections/:date
exports.remove = async (req, res) => {
  try {
    await Reflection.findOneAndDelete({ user: req.user._id, date: req.params.date });
    res.json({ message: 'Reflection deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};