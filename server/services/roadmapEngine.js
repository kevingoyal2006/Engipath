/**
 * Roadmap Generator - Topological Order Engine (Kahn's DAG Algorithm)
 * Guarantees that prerequisites strictly precede dependent skills.
 * e.g. React comes after JavaScript; Node Auth comes after Node.js & MongoDB.
 */

const generateTopologicalRoadmap = (allSkills, careerPath, userProgressList = [], userSkillsList = []) => {
  // Map user progress status by skillId
  const progressMap = new Map();
  userProgressList.forEach(p => {
    if (p.skillId) {
      progressMap.set(p.skillId.toString(), p.status);
    }
  });

  const scoreMap = new Map();
  userSkillsList.forEach(s => {
    if (s.skillId) {
      scoreMap.set(s.skillId.toString(), s.score || 0);
    }
  });

  // Filter skills relevant to the career path
  const careerRequiredMap = new Map();
  if (careerPath && careerPath.requiredSkills) {
    careerPath.requiredSkills.forEach(req => {
      if (req.skillId) {
        const idStr = req.skillId._id ? req.skillId._id.toString() : req.skillId.toString();
        careerRequiredMap.set(idStr, req.priority || 1);
      }
    });
  }

  // Build Graph representations
  const skillMap = new Map();
  const inDegree = new Map();
  const graph = new Map(); // prereq -> dependents

  allSkills.forEach(skill => {
    const idStr = skill._id.toString();
    skillMap.set(idStr, skill);
    inDegree.set(idStr, 0);
    graph.set(idStr, []);
  });

  // Calculate edges & in-degrees safely
  allSkills.forEach(skill => {
    const idStr = skill._id.toString();
    if (skill.prerequisites && skill.prerequisites.length > 0) {
      skill.prerequisites.forEach(prereqId => {
        if (!prereqId) return;
        const prereqStr = prereqId._id ? prereqId._id.toString() : prereqId.toString();
        if (graph.has(prereqStr)) {
          graph.get(prereqStr).push(idStr);
          inDegree.set(idStr, (inDegree.get(idStr) || 0) + 1);
        }
      });
    }
  });

  // Kahn's Algorithm initialization - find all nodes with inDegree 0
  const queue = [];
  inDegree.forEach((degree, idStr) => {
    if (degree === 0) {
      queue.push(idStr);
    }
  });

  const topologicalOrder = [];

  while (queue.length > 0) {
    // Sort queue by Career Path Priority (lower = higher priority), then by estimated hours
    queue.sort((a, b) => {
      const priorityA = careerRequiredMap.get(a) || 99;
      const priorityB = careerRequiredMap.get(b) || 99;
      if (priorityA !== priorityB) return priorityA - priorityB;
      const hoursA = skillMap.get(a)?.estimatedHours || 0;
      const hoursB = skillMap.get(b)?.estimatedHours || 0;
      return hoursA - hoursB;
    });

    const currentId = queue.shift();
    topologicalOrder.push(currentId);

    const dependents = graph.get(currentId) || [];
    dependents.forEach(depId => {
      inDegree.set(depId, inDegree.get(depId) - 1);
      if (inDegree.get(depId) === 0) {
        queue.push(depId);
      }
    });
  }

  // Handle any remaining nodes (in case of cycles or disconnected components)
  allSkills.forEach(skill => {
    const idStr = skill._id.toString();
    if (!topologicalOrder.includes(idStr)) {
      topologicalOrder.push(idStr);
    }
  });

  // Assemble detailed roadmap items
  return topologicalOrder.map((skillIdStr, index) => {
    const skillObj = skillMap.get(skillIdStr);
    const status = progressMap.get(skillIdStr) || 'not-started';
    const score = scoreMap.get(skillIdStr) || 0;
    const priority = careerRequiredMap.get(skillIdStr) || (index + 1);

    // Get prerequisite titles and completion status
    const prereqDetails = (skillObj?.prerequisites || []).map(p => {
      if (!p) return null;
      const pIdStr = p._id ? p._id.toString() : p.toString();
      const pSkill = skillMap.get(pIdStr);
      const pStatus = progressMap.get(pIdStr) || 'not-started';
      return {
        id: pIdStr,
        name: pSkill ? pSkill.name : 'Prerequisite Skill',
        completed: pStatus === 'completed'
      };
    }).filter(Boolean);

    const isPrereqsMet = prereqDetails.every(p => p.completed);

    return {
      order: index + 1,
      skill: skillObj,
      priority,
      prerequisites: prereqDetails,
      prerequisitesMet: isPrereqsMet,
      estimatedHours: skillObj?.estimatedHours || 10,
      resources: skillObj?.resources || [],
      miniTask: skillObj?.miniTask || { title: 'Practice task', instructions: [] },
      status: status,
      score: score,
      isRequiredForTarget: careerRequiredMap.has(skillIdStr)
    };
  });
};

module.exports = { generateTopologicalRoadmap };
