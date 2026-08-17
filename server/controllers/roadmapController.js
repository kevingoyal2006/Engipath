const Skill = require('../models/Skill');
const CareerPath = require('../models/CareerPath');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { generateTopologicalRoadmap } = require('../services/roadmapEngine');
const { generateWeeklyPlan } = require('../services/plannerEngine');

// @desc    Generate/retrieve personalized prerequisite-ordered roadmap
// @route   GET /api/roadmap
// @access  Private (Student)
const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let careerPath = null;

    if (user.targetCareer) {
      careerPath = await CareerPath.findById(user.targetCareer).populate('requiredSkills.skillId');
    }

    // Auto-connect Full-Stack Web Developer if user has no target career set
    if (!careerPath) {
      careerPath = await CareerPath.findOne({ name: /Full-Stack/i }).populate('requiredSkills.skillId');
      if (!careerPath) {
        careerPath = await CareerPath.findOne().populate('requiredSkills.skillId');
      }
      if (careerPath) {
        user.targetCareer = careerPath._id;
        await user.save();
      }
    }

    const allSkills = await Skill.find().populate('prerequisites');
    const userProgress = await Progress.find({ userId: user._id });

    // Generate topological roadmap
    const roadmap = generateTopologicalRoadmap(allSkills, careerPath, userProgress, user.skills);
    
    // Generate weekly plan
    const weeklyPlan = generateWeeklyPlan(roadmap, user.weeklyStudyHours);

    res.json({
      success: true,
      targetCareer: careerPath ? { id: careerPath._id, name: careerPath.name, description: careerPath.description } : null,
      totalSkills: roadmap.length,
      weeklyStudyHours: user.weeklyStudyHours || 10,
      weeklyPlan,
      roadmap
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoadmap };
