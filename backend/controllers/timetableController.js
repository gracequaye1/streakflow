const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
  try {
    const { type } = req.params;
    let timetable = await Timetable.findOne({ user: req.user._id, type });
    if (!timetable) {
      timetable = await Timetable.create({
        user: req.user._id, type,
        title: type === 'school' ? 'School Timetable' : 'Study Planner',
        slots: [],
        activeDays: type === 'school'
          ? ['Saturday', 'Sunday']
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      });
    }
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addSlot = async (req, res) => {
  try {
    const { type } = req.params;
    const timetable = await Timetable.findOneAndUpdate(
      { user: req.user._id, type },
      { $push: { slots: req.body } },
      { new: true, upsert: true }
    );
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.removeSlot = async (req, res) => {
  try {
    const { type, slotId } = req.params;
    const timetable = await Timetable.findOneAndUpdate(
      { user: req.user._id, type },
      { $pull: { slots: { _id: slotId } } },
      { new: true }
    );
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateActiveDays = async (req, res) => {
  try {
    const { type } = req.params;
    const timetable = await Timetable.findOneAndUpdate(
      { user: req.user._id, type },
      { activeDays: req.body.activeDays },
      { new: true }
    );
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
};