const mongoose = require('mongoose');

const PomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    default: 25 // minutes
  },
  completed: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
PomodoroSessionSchema.index({ user: 1, subject: 1, createdAt: -1 });
PomodoroSessionSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('PomodoroSession', PomodoroSessionSchema);