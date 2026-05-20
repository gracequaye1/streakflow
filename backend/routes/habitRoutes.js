const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHabits, createHabit, updateHabit,
  toggleToday, deleteHabit
} = require('../controllers/habitController');

router.use(protect); // All habit routes are protected

router.route('/').get(getHabits).post(createHabit);
router.route('/:id').put(updateHabit).delete(deleteHabit);
router.patch('/:id/toggle', toggleToday);

module.exports = router;