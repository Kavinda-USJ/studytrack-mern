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
      default: '',
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
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);