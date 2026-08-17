/**
 * Weekly Study Planner
 * Allocates uncompleted roadmap skills into achievable weekly modules
 * bounded strictly by student's declared weeklyStudyHours.
 */

const generateWeeklyPlan = (orderedRoadmap, weeklyStudyHours = 10) => {
  const maxWeeklyHours = Math.max(2, Math.min(60, Number(weeklyStudyHours) || 10));
  
  // Filter out completed skills
  const pendingRoadmap = orderedRoadmap.filter(item => item.status !== 'completed');

  let accumulatedHours = 0;
  const currentWeekTasks = [];

  for (const item of pendingRoadmap) {
    const itemHours = item.estimatedHours || 5;
    
    // If adding this task fits within current week cap OR it's the very first pending task
    if (accumulatedHours + itemHours <= maxWeeklyHours || currentWeekTasks.length === 0) {
      accumulatedHours += itemHours;
      currentWeekTasks.push({
        skillId: item.skill._id,
        skillName: item.skill.name,
        category: item.skill.category,
        estimatedHours: itemHours,
        status: item.status,
        prerequisitesMet: item.prerequisitesMet,
        miniTask: item.miniTask,
        resources: item.resources,
        suggestedHoursThisWeek: Math.min(itemHours, maxWeeklyHours)
      });

      // Stop once we hit or exceed the weekly allocated hours
      if (accumulatedHours >= maxWeeklyHours) {
        break;
      }
    }
  }

  const totalPendingHours = pendingRoadmap.reduce((sum, item) => sum + (item.estimatedHours || 0), 0);
  const estimatedWeeksRemaining = totalPendingHours > 0 ? Math.ceil(totalPendingHours / maxWeeklyHours) : 0;

  return {
    weeklyStudyHours: maxWeeklyHours,
    plannedHoursThisWeek: accumulatedHours,
    tasksThisWeek: currentWeekTasks,
    totalPendingHours,
    estimatedWeeksRemaining
  };
};

module.exports = { generateWeeklyPlan };
