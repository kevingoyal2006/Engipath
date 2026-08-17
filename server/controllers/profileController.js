const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private (Student/Admin)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('targetCareer')
      .populate('skills.skillId');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile/skills/goal/hours/socials/academics
// @route   PUT /api/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    const { 
      branch, year, collegeName, cgpa, graduationYear,
      githubUrl, linkedinUrl, portfolioUrl,
      targetCareer, targetCompanies, preferredRoles, bio,
      weeklyStudyHours, learningPreference, skills 
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Academic Fields
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
    if (collegeName !== undefined) user.collegeName = collegeName;
    if (cgpa !== undefined) user.cgpa = Number(cgpa) || 0;
    if (graduationYear !== undefined) user.graduationYear = Number(graduationYear) || 2027;

    // Social Links
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;

    // Placement Goals & Bio
    if (targetCareer !== undefined) user.targetCareer = targetCareer;
    if (bio !== undefined) user.bio = bio;

    if (targetCompanies !== undefined) {
      user.targetCompanies = Array.isArray(targetCompanies) 
        ? targetCompanies 
        : targetCompanies.split(',').map(c => c.trim()).filter(Boolean);
    }

    if (preferredRoles !== undefined) {
      user.preferredRoles = Array.isArray(preferredRoles) 
        ? preferredRoles 
        : preferredRoles.split(',').map(r => r.trim()).filter(Boolean);
    }

    // Study Preferences
    if (weeklyStudyHours !== undefined) user.weeklyStudyHours = Math.max(1, Math.min(60, Number(weeklyStudyHours)));
    if (learningPreference !== undefined) user.learningPreference = learningPreference;

    // Skills Multi-Select Updates
    if (skills && Array.isArray(skills)) {
      const updatedSkills = skills.map(s => {
        const scoreVal = Number(s.score) || 0;
        let statusVal = 'Missing';
        if (scoreVal >= 70 || s.level === 'advanced') statusVal = 'Known';
        else if (scoreVal > 0 || s.level === 'intermediate') statusVal = 'Developing';

        return {
          skillId: s.skillId,
          level: s.level || 'beginner',
          score: scoreVal,
          status: statusVal
        };
      });

      user.skills = updatedSkills;
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('targetCareer')
      .populate('skills.skillId');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
