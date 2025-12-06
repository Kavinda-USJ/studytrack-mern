const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'streak', 'subject', 'custom'],
      required: [true, 'Please specify goal type'],
    },
    title: {
      type: String,
      required: [true, 'Please add a goal title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    target: {
      type: Number,
      required: [true, 'Please set a target'],
      min: 1,
    },
    current: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please specify unit'],
      enum: ['minutes', 'tasks', 'sessions', 'days', 'custom'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'Please set end date'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    subject: {
      type: String, // For subject-specific goals
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate progress percentage
goalSchema.virtual('progress').get(function() {
  return Math.min((this.current / this.target) * 100, 100);
});

// Check if goal is expired
goalSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate;
});

// Auto-mark as completed when target is reached
goalSchema.pre('save', function(next) {
  if (this.current >= this.target && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);