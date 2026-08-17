const express = require('express');
const router = express.Router();
const { getProjectRecommendations, toggleProjectCompletion } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/recommendations', protect, getProjectRecommendations);
router.patch('/:id/complete', protect, toggleProjectCompletion);

module.exports = router;
