const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSchedule,
  addTask,
  toggleTask,
  deleteTask,
  resetDone,
} = require('../controllers/scheduleController');

router.use(protect);

router.get('/:type',                        getSchedule);
router.post('/:type/tasks',                 addTask);
router.patch('/:type/tasks/:taskId/toggle', toggleTask);
router.delete('/:type/tasks/:taskId',       deleteTask);
router.post('/:type/reset',                 resetDone);

module.exports = router;
