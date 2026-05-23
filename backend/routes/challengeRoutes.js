const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChallenges, createChallenge, updateChallenge,
  deleteChallenge, getLogs, checkIn
} = require('../controllers/challengeController');

router.use(protect);
router.route('/').get(getChallenges).post(createChallenge);
router.route('/:id').put(updateChallenge).delete(deleteChallenge);
router.get('/:id/logs', getLogs);
router.post('/:id/checkin', checkIn);

module.exports = router;