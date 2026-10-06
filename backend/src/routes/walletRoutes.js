const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const walletController = require('../controllers/walletController');

router.get('/', authMiddleware, walletController.getWallet);

module.exports = router;
