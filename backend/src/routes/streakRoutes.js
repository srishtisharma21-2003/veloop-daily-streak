const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const streakController = require('../controllers/streakController');
const { claimLimiter } = require('../middleware/rateLimiter');

router.get('/', authMiddleware, streakController.getStreak);
router.get('/status', authMiddleware, streakController.getStatus);
router.post('/claim', authMiddleware, claimLimiter, streakController.claimReward);
router.get('/history', authMiddleware, streakController.getHistory);

module.exports = router;
