/**
 * Skill-Gap Engine
 * Classifies required skills for a student's target career as:
 * - 'Known': Completed in Progress OR Assessment Score >= 70%
 * - 'Developing': In-progress OR Assessment Score between 1% and 69% OR self-reported intermediate
 * - 'Missing': Not started, Assessment Score == 0
 */

const classifySkillGap = (skillIdStr, userSkillsMap, progressMap) => {
  const userSkill = userSkillsMap.get(skillIdStr) || {};
  const progress = progressMap.get(skillIdStr) || {};

  const statusFromProgress = progress.status;
  const score = userSkill.score || 0;
  const selfLevel = userSkill.level || 'beginner';

  if (statusFromProgress === 'completed' || score >= 70 || (selfLevel === 'advanced' && score >= 50)) {
    return 'Known';
  } else if (statusFromProgress === 'in-progress' || (score > 0 && score < 70) || selfLevel === 'intermediate') {
    return 'Developing';
  } else {
    return 'Missing';
  }
};

const calculateSkillGaps = (careerPath, user, userProgressList = []) => {
  if (!careerPath || !careerPath.requiredSkills) {
    return [];
  }

  // Create fast lookup maps
  const userSkillsMap = new Map();
  if (user.skills && Array.isArray(user.skills)) {
    user.skills.forEach(s => {
      userSkillsMap.set(s.skillId.toString(), s);
    });
  }

  const progressMap = new Map();
  userProgressList.forEach(p => {
    progressMap.set(p.skillId.toString(), p);
  });

  return careerPath.requiredSkills.map(reqSkill => {
    const skillObj = reqSkill.skillId;
    const skillIdStr = skillObj._id ? skillObj._id.toString() : skillObj.toString();
    const status = classifySkillGap(skillIdStr, userSkillsMap, progressMap);
    
    return {
      skill: skillObj,
      priority: reqSkill.priority || 1,
      minimumLevel: reqSkill.minimumLevel || 'intermediate',
      status: status,
      score: userSkillsMap.get(skillIdStr)?.score || 0,
      progressStatus: progressMap.get(skillIdStr)?.status || 'not-started'
    };
  });
};

module.exports = { calculateSkillGaps, classifySkillGap };
