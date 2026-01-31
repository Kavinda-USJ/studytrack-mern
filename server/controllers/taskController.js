const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks for logged-in user with filtering and sorting
// @route   GET /api/tasks?subject=xxx&sortBy=deadline
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { subject, sortBy } = req.query;
    
    // Build query
    let query = { user: req.user._id };
    
    // Filter by subject if provided
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (sortBy === 'deadline') {
      sortOption = { deadline: 1 }; // Ascending (nearest deadline first)
    } else if (sortBy === 'priority') {
      sortOption = { priority: -1 }; // High to Low
    }
    
    const tasks = await Task.find(query).sort(sortOption);
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, subject, description, deadline, priority } = req.body;

    // Validation: Title and Subject are required
    if (!title || !subject) {
      return res.status(400).json({ message: 'Please add title and subject' });
    }

    // Validation: Check if deadline is in the past
    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ 
          message: 'Deadline cannot be in the past',
          field: 'deadline'
        });
      }
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      subject,
      description,
      deadline,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Validation: Check if new deadline is in the past
    if (req.body.deadline) {
      const selectedDate = new Date(req.body.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ 
          message: 'Deadline cannot be in the past',
          field: 'deadline'
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle task completion
// @route   PUT /api/tasks/:id/complete
// @access  Private
const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    // Update user's completed tasks count
    if (task.completed) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { tasksCompleted: 1 },
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { tasksCompleted: -1 },
      });
    }

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
};