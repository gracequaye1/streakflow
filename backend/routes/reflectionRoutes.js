const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAll, getByDate, upsert, update, remove
} = require('../controllers/reflectionController');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(upsert);

router.route('/:date')
  .get(getByDate)
  .put(update)
  .delete(remove);

module.exports = router;
