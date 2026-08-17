const Project = require('../models/Project');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { evaluateProjects } = require('../services/projectEngine');

// @desc    Get suitable projects (recommended / locked / completed)
// @route   GET /api/projects/recommendations
// @access  Private (Student)
const getProjectRecommendations = async (req, res) => {
  try {
    const allProjects = await Project.find().populate('requiredSkills', 'name category estimatedHours');
    const userProgress = await Progress.find({ userId: req.user._id });
    
    const user = await User.findById(req.user._id);
    const completedProjects = user.completedProjects || [];

    const evaluated = evaluateProjects(allProjects, userProgress, completedProjects);

    res.json({
      success: true,
      totalProjects: evaluated.length,
      recommended: evaluated.filter(p => p.status === 'recommended'),
      locked: evaluated.filter(p => p.status === 'locked'),
      completed: evaluated.filter(p => p.status === 'completed'),
      projects: evaluated
    });
  } catch (error) {
    console.error('Project recommendations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle project completion status
// @route   PATCH /api/projects/:id/complete
// @access  Private (Student)
const toggleProjectCompletion = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    const user = await User.findById(req.user._id);

    if (!user.completedProjects) {
      user.completedProjects = [];
    }

    const index = user.completedProjects.indexOf(projectId);
    let isCompleted = false;

    if (index > -1) {
      user.completedProjects.splice(index, 1);
      isCompleted = false;
    } else {
      user.completedProjects.push(projectId);
      isCompleted = true;
    }

    // Log Activity Feed
    if (!user.activities) user.activities = [];
    user.activities.unshift({
      title: isCompleted 
        ? `Completed Portfolio Project: "${project?.title || 'Project'}"` 
        : `Marked project "${project?.title || 'Project'}" as incomplete`,
      type: 'project',
      scoreImpact: isCompleted ? '+2.0 pts' : '-2.0 pts',
      timestamp: new Date()
    });

    if (user.activities.length > 15) {
      user.activities = user.activities.slice(0, 15);
    }

    user.markModified('activities');
    await user.save();

    res.json({
      success: true,
      message: isCompleted ? 'Project marked as completed' : 'Project marked as incomplete',
      isCompleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjectRecommendations, toggleProjectCompletion };
