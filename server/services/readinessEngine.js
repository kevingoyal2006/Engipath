/**
 * Explainable Placement-Readiness Score Engine
 * Formula:
 * Readiness = (CompletedRequiredSkills / TotalRequiredSkills) * 70
 *           + (AssessmentAverage / 100) * 20
 *           + (CompletedProjects / RecommendedProjects) * 10
 */

const calculateReadinessScore = ({
  completedRequiredSkills = 0,
  totalRequiredSkills = 1,
  assessmentAverage = 0,
  completedProjects = 0,
  recommendedProjects = 1
}) => {
  const safeTotalRequired = Math.max(1, totalRequiredSkills);
  const safeRecommendedProj = Math.max(1, recommendedProjects);

  const skillsRatio = Math.min(1, Math.max(0, completedRequiredSkills / safeTotalRequired));
  const assessmentRatio = Math.min(1, Math.max(0, assessmentAverage / 100));
  const projectsRatio = Math.min(1, Math.max(0, completedProjects / safeRecommendedProj));

  const skillsComponent = Number((skillsRatio * 70).toFixed(2));
  const assessmentComponent = Number((assessmentRatio * 20).toFixed(2));
  const projectsComponent = Number((projectsRatio * 10).toFixed(2));

  const totalScore = Number((skillsComponent + assessmentComponent + projectsComponent).toFixed(1));

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skillsComponent: {
        score: skillsComponent,
        maxScore: 70,
        completed: completedRequiredSkills,
        total: safeTotalRequired
      },
      assessmentComponent: {
        score: assessmentComponent,
        maxScore: 20,
        average: assessmentAverage
      },
      projectsComponent: {
        score: projectsComponent,
        maxScore: 10,
        completed: completedProjects,
        recommended: safeRecommendedProj
      }
    },
    formulaExplanation: `Readiness (${totalScore}%) = (${completedRequiredSkills}/${safeTotalRequired} skills * 70) + (${assessmentAverage.toFixed(0)}% quiz avg * 20) + (${completedProjects}/${safeRecommendedProj} projects * 10)`
  };
};

module.exports = { calculateReadinessScore };
