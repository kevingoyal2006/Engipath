const Progress = require('../models/Progress');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Update skill/task/project progress
// @route   PATCH /api/progress/:skillId
// @access  Private (Student)
const updateProgress = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { status } = req.body;

    if (!['not-started', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be not-started, in-progress, or completed' });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, skillId },
      {
        status,
        completedAt: status === 'completed' ? new Date() : null
      },
      { upsert: true, new: true }
    );

    // Sync with User's skills array
    const user = await User.findById(req.user._id);
    if (!user.skills) user.skills = [];

    const existingIndex = user.skills.findIndex(s => s.skillId && s.skillId.toString() === skillId);
    
    let statusLabel = 'Missing';
    let defaultScore = 0;
    if (status === 'completed') {
      statusLabel = 'Known';
      defaultScore = 90;
    } else if (status === 'in-progress') {
      statusLabel = 'Developing';
      defaultScore = 50;
    }

    if (existingIndex >= 0) {
      user.skills[existingIndex].status = statusLabel;
      if (status === 'completed' && user.skills[existingIndex].score < 70) {
        user.skills[existingIndex].score = 90;
      }
    } else {
      user.skills.push({
        skillId,
        level: status === 'completed' ? 'advanced' : 'beginner',
        score: defaultScore,
        status: statusLabel
      });
    }

    // Log Activity Feed
    if (!user.activities) user.activities = [];
    const impactText = status === 'completed' ? '+7.8 pts' : (status === 'in-progress' ? '+3.5 pts' : '0 pts');
    user.activities.unshift({
      title: `Updated progress for ${skill.name} to "${status.replace('-', ' ')}"`,
      type: 'progress',
      scoreImpact: impactText,
      timestamp: new Date()
    });

    if (user.activities.length > 15) {
      user.activities = user.activities.slice(0, 15);
    }

    user.markModified('skills');
    user.markModified('activities');
    await user.save();

    res.json({
      success: true,
      message: `Progress updated to ${status}`,
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProgress };
