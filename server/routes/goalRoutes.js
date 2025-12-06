const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats,
  toggleGoalActive,
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Stats route (must be before /:id routes)
router.get('/stats', getGoalStats);

// Main CRUD routes
router.route('/').get(getGoals).post(createGoal);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

// Special routes
router.put('/:id/progress', updateGoalProgress);
router.put('/:id/toggle', toggleGoalActive);

module.exports = router;