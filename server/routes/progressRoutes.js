const express = require('express');
const router = express.Router();
const { updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.patch('/:skillId', protect, updateProgress);

module.exports = router;
