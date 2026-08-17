const express = require('express');
const router = express.Router();
const CareerPath = require('../models/CareerPath');

// @desc    Get all available career paths
// @route   GET /api/careers
// @access  Public / Student
router.get('/', async (req, res) => {
  try {
    const careers = await CareerPath.find().populate('requiredSkills.skillId', 'name category estimatedHours');
    res.json({
      success: true,
      careers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
