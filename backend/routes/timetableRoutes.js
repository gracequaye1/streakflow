const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTimetable, addSlot, removeSlot, updateActiveDays
} = require('../controllers/timetableController');

router.use(protect);
router.get('/:type', getTimetable);
router.post('/:type/slots', addSlot);
router.delete('/:type/slots/:slotId', removeSlot);
router.put('/:type/days', updateActiveDays);

module.exports = router;