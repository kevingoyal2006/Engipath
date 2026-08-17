const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Skill = require('../models/Skill');

// @desc    Get assessment questions grouped by skill
// @route   GET /api/assessments/questions
// @access  Private (Student)
const getQuestions = async (req, res) => {
  try {
    const { skillId } = req.query;
    let filter = {};

    if (skillId) {
      filter.skillId = skillId;
    }

    const questions = await QuizQuestion.find(filter).populate('skillId', 'name category');

    // Group questions by skill
    const grouped = {};
    questions.forEach(q => {
      if (!q.skillId) return;
      const sId = q.skillId._id ? q.skillId._id.toString() : q.skillId.toString();
      if (!grouped[sId]) {
        grouped[sId] = {
          skillId: sId,
          skillName: q.skillId.name || 'Core Skill',
          category: q.skillId.category || 'General',
          questions: []
        };
      }
      grouped[sId].questions.push({
        _id: q._id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty
      });
    });

    res.json({
      success: true,
      data: Object.values(grouped),
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Get assessment questions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment responses, grade quiz, update scores, log activity & progress
// @route   POST /api/assessments/submit
// @access  Private (Student)
const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; 

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'No assessment answers submitted' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } });
    const qMap = new Map(questions.map(q => [q._id.toString(), q]));

    // Grade submissions by skill
    const skillStats = {};
    let overallCorrect = 0;

    const detailedResults = answers.map(ans => {
      const question = qMap.get(ans.questionId.toString());
      if (!question) return null;

      const isCorrect = Number(ans.selectedOption) === Number(question.correctAnswer);
      if (isCorrect) overallCorrect++;

      const sId = question.skillId.toString();
      if (!skillStats[sId]) {
        skillStats[sId] = { total: 0, correct: 0 };
      }
      skillStats[sId].total++;
      if (isCorrect) skillStats[sId].correct++;

      return {
        questionId: question._id,
        questionText: question.question,
        options: question.options,
        selectedOption: Number(ans.selectedOption),
        correctAnswer: Number(question.correctAnswer),
        explanation: question.explanation,
        isCorrect
      };
    }).filter(Boolean);

    // Update User skill scores in DB
    const user = await User.findById(req.user._id);
    if (!user.skills) user.skills = [];

    const existingSkillsMap = new Map(user.skills.map(s => [s.skillId.toString(), s]));

    for (const [sId, stats] of Object.entries(skillStats)) {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      let status = 'Missing';
      if (percentage >= 70) status = 'Known';
      else if (percentage > 0) status = 'Developing';

      let level = 'beginner';
      if (percentage >= 70) level = 'advanced';
      else if (percentage >= 40) level = 'intermediate';

      if (existingSkillsMap.has(sId)) {
        const item = existingSkillsMap.get(sId);
        item.score = percentage;
        item.status = status;
        item.level = level;
      } else {
        user.skills.push({
          skillId: sId,
          score: percentage,
          level: level,
          status: status
        });
      }

      // Update or insert Progress record in DB
      const progStatus = percentage >= 70 ? 'completed' : (percentage > 0 ? 'in-progress' : 'not-started');
      await Progress.findOneAndUpdate(
        { userId: user._id, skillId: sId },
        {
          status: progStatus,
          completedAt: percentage >= 70 ? new Date() : null
        },
        { upsert: true, new: true }
      );
    }

    const totalSubmitted = detailedResults.length;
    const overallScorePercentage = totalSubmitted > 0 ? Math.round((overallCorrect / totalSubmitted) * 100) : 0;

    // Set Assessment Completed Flag
    user.hasCompletedAssessment = true;

    // Log Activity Feed
    if (!user.activities) user.activities = [];
    user.activities.unshift({
      title: `Submitted Skill Assessment (${overallCorrect}/${totalSubmitted} correct — ${overallScorePercentage}% Score)`,
      type: 'assessment',
      scoreImpact: `+${(overallScorePercentage * 0.2).toFixed(1)} pts`,
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
      summary: {
        totalSubmitted,
        overallCorrect,
        overallScorePercentage
      },
      skillBreakdown: skillStats,
      results: detailedResults
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuestions, submitAssessment };
