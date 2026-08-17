const User = require('../models/User');
const CareerPath = require('../models/CareerPath');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Progress = require('../models/Progress');
const { calculateSkillGaps } = require('../services/gapEngine');
const { generateTopologicalRoadmap } = require('../services/roadmapEngine');
const { generateWeeklyPlan } = require('../services/plannerEngine');
const { calculateReadinessScore } = require('../services/readinessEngine');
const { evaluateProjects } = require('../services/projectEngine');

// @desc    Get dashboard metrics, readiness score, next action, & chart data
// @route   GET /api/dashboard
// @access  Private (Student)
const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('targetCareer');
    
    let careerPath = user.targetCareer;
    if (!careerPath) {
      careerPath = await CareerPath.findOne({ name: /Full-Stack/i });
      if (careerPath) {
        user.targetCareer = careerPath._id;
        await user.save();
      }
    }

    const allSkills = await Skill.find().populate('prerequisites');
    const userProgress = await Progress.find({ userId: user._id });

    // 1. Skill Gap Analysis
    const skillGaps = calculateSkillGaps(careerPath, user, userProgress);
    
    const knownSkills = skillGaps.filter(s => s.status === 'Known');
    const developingSkills = skillGaps.filter(s => s.status === 'Developing');
    const missingSkills = skillGaps.filter(s => s.status === 'Missing');

    // 2. Ordered Roadmap & Weekly Plan
    const roadmap = generateTopologicalRoadmap(allSkills, careerPath, userProgress, user.skills);
    const weeklyPlan = generateWeeklyPlan(roadmap, user.weeklyStudyHours);

    // 3. Projects Evaluation
    const allProjects = await Project.find().populate('requiredSkills');
    const completedProjIds = user.completedProjects || [];
    const evaluatedProjects = evaluateProjects(allProjects, userProgress, completedProjIds);
    
    const recommendedProjects = evaluatedProjects.filter(p => p.status === 'recommended');
    const completedProjectsCount = evaluatedProjects.filter(p => p.status === 'completed').length;

    // 4. Calculate Readiness Score
    const totalRequiredSkillsCount = careerPath && careerPath.requiredSkills ? careerPath.requiredSkills.length : allSkills.length;
    const completedRequiredSkillsCount = knownSkills.length;

    // Calculate quiz assessment average score across user skills
    const scores = (user.skills || []).map(s => s.score || 0).filter(sc => sc > 0);
    const assessmentAverage = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const readiness = calculateReadinessScore({
      completedRequiredSkills: completedRequiredSkillsCount,
      totalRequiredSkills: totalRequiredSkillsCount,
      assessmentAverage: assessmentAverage,
      completedProjects: completedProjectsCount,
      recommendedProjects: Math.max(1, recommendedProjects.length)
    });

    // 5. Next Recommended Action
    let nextAction = null;
    const nextIncompleteRoadmapItem = roadmap.find(item => item.status !== 'completed');

    if (!user.hasCompletedAssessment) {
      nextAction = {
        type: 'take_assessment',
        title: 'Step 1: Complete Technical Assessment',
        description: 'Take a 5-minute quiz to analyze your abilities, generate your topological roadmap, & unlock project ladders.',
        estimatedHours: 1
      };
    } else if (nextIncompleteRoadmapItem) {
      nextAction = {
        type: 'learn_skill',
        title: `Learn: ${nextIncompleteRoadmapItem.skill.name}`,
        description: `Start module in ${nextIncompleteRoadmapItem.skill.category}. Prerequisite: ${nextIncompleteRoadmapItem.prerequisitesMet ? 'Met ✅' : 'Pending ⚠️'}`,
        skillId: nextIncompleteRoadmapItem.skill._id,
        prerequisitesMet: nextIncompleteRoadmapItem.prerequisitesMet,
        estimatedHours: nextIncompleteRoadmapItem.estimatedHours
      };
    } else if (recommendedProjects.length > 0) {
      nextAction = {
        type: 'build_project',
        title: `Build Project: ${recommendedProjects[0].project.title}`,
        description: recommendedProjects[0].project.description,
        projectId: recommendedProjects[0].project._id
      };
    } else {
      nextAction = {
        type: 'congratulations',
        title: 'Career Path Mastered!',
        description: 'You have completed all key skills and recommended projects.'
      };
    }

    // 6. Chart Data Formatter
    const chartData = roadmap.map(item => ({
      skill: item.skill.name,
      score: item.score,
      status: item.status,
      estimatedHours: item.estimatedHours
    }));

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        weeklyStudyHours: user.weeklyStudyHours,
        targetCareer: careerPath ? careerPath.name : 'Web Developer',
        hasCompletedAssessment: !!user.hasCompletedAssessment
      },
      hasCompletedAssessment: !!user.hasCompletedAssessment,
      readiness,
      skillCounts: {
        total: totalRequiredSkillsCount,
        known: knownSkills.length,
        developing: developingSkills.length,
        missing: missingSkills.length
      },
      skillsBreakdown: {
        known: knownSkills.map(s => s.skill.name || s.skill),
        developing: developingSkills.map(s => s.skill.name || s.skill),
        missing: missingSkills.map(s => s.skill.name || s.skill)
      },
      weeklyPlan,
      nextAction,
      chartData,
      projectsSummary: {
        recommended: recommendedProjects.slice(0, 3),
        completedCount: completedProjectsCount
      },
      activities: user.activities || []
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
