const Goal = require('../models/Goal');
const User = require('../models/User');

// @desc    Get all goals for logged-in user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Make sure user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { type, title, description, target, unit, endDate, subject } = req.body;

    if (!title || !target || !unit || !type) {
      return res.status(400).json({ message: 'Please provide title, target, unit, and type' });
    }

    // Calculate end date based on goal type if not provided
    let calculatedEndDate = endDate;
    if (!endDate) {
      const now = new Date();
      switch (type) {
        case 'daily':
          calculatedEndDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'weekly':
          calculatedEndDate = new Date(now.setDate(now.getDate() + 7));
          break;
        case 'streak':
          calculatedEndDate = new Date(now.setDate(now.getDate() + target));
          break;
        default:
          calculatedEndDate = new Date(now.setDate(now.getDate() + 30)); // 30 days default
      }
    }

    const goal = await Goal.create({
      user: req.user._id,
      type,
      title,
      description,
      target,
      unit,
      endDate: calculatedEndDate,
      subject,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Make sure user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id/progress
// @access  Private
const updateGoalProgress = async (req, res) => {
  try {
    const { increment } = req.body;
    
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Make sure user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Increment progress
    goal.current = Math.min(goal.current + (increment || 1), goal.target);
    
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Make sure user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
const getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    const stats = {
      totalGoals: goals.length,
      activeGoals: goals.filter(g => g.active && g.current < g.target).length,
      completedGoals: goals.filter(g => g.completed).length,
      expiredGoals: goals.filter(g => new Date() > g.endDate && !g.completed).length,
      successRate: goals.length > 0 
        ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100)
        : 0,
      averageProgress: goals.length > 0
        ? Math.round(goals.reduce((acc, g) => acc + (g.current / g.target * 100), 0) / goals.length)
        : 0,
      goalsByType: {
        daily: goals.filter(g => g.type === 'daily').length,
        weekly: goals.filter(g => g.type === 'weekly').length,
        streak: goals.filter(g => g.type === 'streak').length,
        subject: goals.filter(g => g.type === 'subject').length,
        custom: goals.filter(g => g.type === 'custom').length,
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle goal active status
// @route   PUT /api/goals/:id/toggle
// @access  Private
const toggleGoalActive = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Make sure user owns the goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    goal.active = !goal.active;
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats,
  toggleGoalActive,
};