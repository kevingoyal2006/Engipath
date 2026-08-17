const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAdminMetrics,
  createCareer, updateCareer, deleteCareer,
  createSkill, updateSkill, deleteSkill,
  createProject, updateProject, deleteProject,
  createQuizQuestion, updateQuizQuestion, deleteQuizQuestion
} = require('../controllers/adminController');

// All admin routes require token + admin role
router.use(protect, adminOnly);

router.get('/metrics', getAdminMetrics);

// Career management
router.post('/careers', createCareer);
router.put('/careers/:id', updateCareer);
router.delete('/careers/:id', deleteCareer);

// Skill management
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Project management
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Quiz management
router.post('/quiz', createQuizQuestion);
router.put('/quiz/:id', updateQuizQuestion);
router.delete('/quiz/:id', deleteQuizQuestion);

module.exports = router;
