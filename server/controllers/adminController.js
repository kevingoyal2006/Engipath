const User = require('../models/User');
const CareerPath = require('../models/CareerPath');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const QuizQuestion = require('../models/QuizQuestion');
const Progress = require('../models/Progress');

// @desc    Get high-level metrics (User count, skill gap frequency)
// @route   GET /api/admin/metrics
// @access  Private (Admin)
const getAdminMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalSkills = await Skill.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalQuizzes = await QuizQuestion.countDocuments();

    // Calculate common skill gaps across all students
    const allProgress = await Progress.find().populate('skillId', 'name category');
    
    const skillGapMap = {};
    allProgress.forEach(p => {
      if (p.skillId && (p.status === 'not-started' || p.status === 'in-progress')) {
        const name = p.skillId.name;
        skillGapMap[name] = (skillGapMap[name] || 0) + 1;
      }
    });

    const commonSkillGaps = Object.entries(skillGapMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      metrics: {
        totalStudents: totalUsers,
        totalAdmins,
        totalSkills,
        totalProjects,
        totalQuizQuestions: totalQuizzes,
        commonSkillGaps
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- CAREER PATH CRUD ---
const createCareer = async (req, res) => {
  try {
    const career = await CareerPath.create(req.body);
    res.status(201).json({ success: true, career });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const career = await CareerPath.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, career });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCareer = async (req, res) => {
  try {
    await CareerPath.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Career path deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- SKILL CRUD ---
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- PROJECT CRUD ---
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- QUIZ CRUD ---
const createQuizQuestion = async (req, res) => {
  try {
    const quiz = await QuizQuestion.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateQuizQuestion = async (req, res) => {
  try {
    const quiz = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteQuizQuestion = async (req, res) => {
  try {
    await QuizQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quiz question deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdminMetrics,
  createCareer, updateCareer, deleteCareer,
  createSkill, updateSkill, deleteSkill,
  createProject, updateProject, deleteProject,
  createQuizQuestion, updateQuizQuestion, deleteQuizQuestion
};
