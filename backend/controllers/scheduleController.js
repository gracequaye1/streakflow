const Schedule = require('../models/Schedule');

const DEFAULT_TASKS = {
  personal: [
    { title: 'Morning devotion',   time: '06:00', color: '#f59e0b' },
    { title: 'Morning walk',       time: '07:00', color: '#10b981' },
    { title: 'Breakfast + vitamins', time: '08:00', color: '#f97316' },
    { title: 'Deep focus block',   time: '09:00', color: '#3b82f6' },
    { title: 'Lunch break',        time: '12:00', color: '#84cc16' },
    { title: 'Evening workout',    time: '17:00', color: '#ef4444' },
    { title: 'Family / social',    time: '19:00', color: '#a78bfa' },
    { title: 'Skincare routine',   time: '21:00', color: '#ec4899' },
    { title: 'Read & wind down',   time: '22:00', color: '#8b5cf6' },
  ],
  work: [
    { title: 'Check emails & Slack',          time: '08:00', color: '#3b82f6' },
    { title: 'Deep work block 1',             time: '09:00', color: '#6366f1' },
    { title: 'Team standup',                  time: '11:00', color: '#8b5cf6' },
    { title: 'Lunch',                         time: '12:00', color: '#10b981' },
    { title: 'Deep work block 2',             time: '13:00', color: '#6366f1' },
    { title: 'Review & reply to messages',    time: '15:30', color: '#f59e0b' },
    { title: 'Plan tomorrow',                 time: '16:30', color: '#ef4444' },
    { title: 'EOD wrap up',                   time: '17:00', color: '#64748b' },
  ],
  freetime: [
    { title: 'Sleep in / rest',    time: '08:00', color: '#8b5cf6' },
    { title: 'Hobby time',         time: '10:00', color: '#ec4899' },
    { title: 'Cook a nice meal',   time: '12:00', color: '#f59e0b' },
    { title: 'Outdoor activity',   time: '14:00', color: '#10b981' },
    { title: 'Creative project',   time: '16:00', color: '#3b82f6' },
    { title: 'Social time',        time: '18:00', color: '#f97316' },
    { title: 'Movie / series',     time: '20:00', color: '#6366f1' },
    { title: 'Journaling',         time: '22:00', color: '#84cc16' },
  ],
};

// GET /api/schedule/:type
exports.getSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findOne({
      user: req.user._id,
      type: req.params.type,
    });

    // Seed defaults on first load
    if (!schedule) {
      schedule = await Schedule.create({
        user: req.user._id,
        type: req.params.type,
        tasks: DEFAULT_TASKS[req.params.type] || [],
      });
    }

    res.json(schedule);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/schedule/:type/tasks  — add a task
exports.addTask = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { user: req.user._id, type: req.params.type },
      { $push: { tasks: req.body } },
      { new: true, upsert: true }
    );
    res.json(schedule);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PATCH /api/schedule/:type/tasks/:taskId/toggle
exports.toggleTask = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      user: req.user._id,
      type: req.params.type,
    });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const task = schedule.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.done = !task.done;
    await schedule.save();
    res.json(schedule);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/schedule/:type/tasks/:taskId
exports.deleteTask = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { user: req.user._id, type: req.params.type },
      { $pull: { tasks: { _id: req.params.taskId } } },
      { new: true }
    );
    res.json(schedule);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/schedule/:type/reset  — reset done states each day
exports.resetDone = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      user: req.user._id,
      type: req.params.type,
    });
    if (!schedule) return res.status(404).json({ message: 'Not found' });

    schedule.tasks.forEach(t => { t.done = false; });
    await schedule.save();
    res.json(schedule);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
