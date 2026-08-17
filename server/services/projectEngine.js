/**
 * Project Recommender Engine
 * Evaluates projects against student progress and labels them as:
 * - 'recommended': Beginner projects OR > 30% required skills complete / in progress
 * - 'completed': Student completed the project checklist
 * - 'locked': Advanced projects with missing foundational prerequisites
 */

const evaluateProjects = (allProjects = [], userProgressList = [], completedProjectIds = []) => {
  const completedSkillIds = new Set();
  const inProgressSkillIds = new Set();

  userProgressList.forEach(p => {
    if (!p.skillId) return;
    const sId = p.skillId._id ? p.skillId._id.toString() : p.skillId.toString();
    if (p.status === 'completed') {
      completedSkillIds.add(sId);
    } else if (p.status === 'in-progress') {
      inProgressSkillIds.add(sId);
    }
  });

  const completedProjSet = new Set(completedProjectIds.map(id => id.toString()));

  const evaluated = allProjects.map(project => {
    const reqSkills = project.requiredSkills || [];
    const totalReq = reqSkills.length;
    
    let completedCount = 0;
    let inProgressCount = 0;

    reqSkills.forEach(req => {
      if (!req) return;
      const idStr = req._id ? req._id.toString() : req.toString();
      if (completedSkillIds.has(idStr)) {
        completedCount++;
      } else if (inProgressSkillIds.has(idStr)) {
        inProgressCount++;
      }
    });

    const completionRatio = totalReq > 0 ? (completedCount / totalReq) : 1;
    const partialRatio = totalReq > 0 ? ((completedCount + 0.5 * inProgressCount) / totalReq) : 1;

    let recommendationStatus = 'locked';
    if (completedProjSet.has(project._id.toString())) {
      recommendationStatus = 'completed';
    } else if (project.difficulty === 'beginner' || completionRatio >= 0.3 || partialRatio >= 0.4 || totalReq === 0) {
      // Beginner projects & projects with foundational skills touched are recommended!
      recommendationStatus = 'recommended';
    } else {
      recommendationStatus = 'locked';
    }

    return {
      project,
      status: recommendationStatus,
      completedSkillsCount: completedCount,
      totalRequiredSkills: totalReq,
      matchPercentage: Math.max(25, Math.round(partialRatio * 100))
    };
  });

  // Sort: Recommended first, then Completed, then Locked; order by difficulty
  const difficultyWeight = { beginner: 1, intermediate: 2, advanced: 3 };
  const statusWeight = { recommended: 1, completed: 2, locked: 3 };

  return evaluated.sort((a, b) => {
    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[a.status] - statusWeight[b.status];
    }
    return (difficultyWeight[a.project.difficulty] || 1) - (difficultyWeight[b.project.difficulty] || 1);
  });
};

module.exports = { evaluateProjects };
