const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // ✅ FIXED - destructure 'protect'
const Task = require('../models/Task');
const PomodoroSession = require('../models/PomodoroSession');

// Get subject-wise analytics
router.get('/subjects', protect, async (req, res) => { // ✅ Use 'protect' instead of 'auth'
  try {
    const userId = req.user.id;
    
    // Get all unique subjects for this user
    const subjects = await Task.distinct('subject', { user: userId });
    
    const analyticsData = [];
    
    for (const subject of subjects) {
      // Get total study time from Pomodoro sessions
      const pomodoroSessions = await PomodoroSession.find({
        user: userId,
        subject: subject,
        completed: true
      });
      
      const totalStudyTime = pomodoroSessions.reduce((acc, session) => {
        return acc + (session.duration || 25); // default 25 mins
      }, 0);
      
      // Get tasks completed
      const tasksCompleted = await Task.countDocuments({
        user: userId,
        subject: subject,
        completed: true
      });
      
      // Get total tasks for this subject
      const totalTasks = await Task.countDocuments({
        user: userId,
        subject: subject
      });
      
      // Calculate this week's data
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyPomodoros = await PomodoroSession.find({
        user: userId,
        subject: subject,
        completed: true,
        createdAt: { $gte: oneWeekAgo }
      });
      
      const weeklyStudyTime = weeklyPomodoros.reduce((acc, session) => {
        return acc + (session.duration || 25);
      }, 0);
      
      const weeklyTasksCompleted = await Task.countDocuments({
        user: userId,
        subject: subject,
        completed: true,
        completedAt: { $gte: oneWeekAgo }
      });
      
      analyticsData.push({
        subject,
        totalStudyTime, // in minutes
        totalStudyHours: (totalStudyTime / 60).toFixed(2),
        tasksCompleted,
        totalTasks,
        completionRate: totalTasks > 0 ? ((tasksCompleted / totalTasks) * 100).toFixed(1) : 0,
        weeklyStudyTime,
        weeklyStudyHours: (weeklyStudyTime / 60).toFixed(2),
        weeklyTasksCompleted,
        pomodoroCount: pomodoroSessions.length,
        weeklyPomodoroCount: weeklyPomodoros.length
      });
    }
    
    // Sort by total study time (descending)
    analyticsData.sort((a, b) => b.totalStudyTime - a.totalStudyTime);
    
    res.json({
      success: true,
      data: analyticsData
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get detailed analytics for a specific subject
router.get('/subjects/:subject', protect, async (req, res) => { // ✅ Changed to 'protect'
  try {
    const userId = req.user.id;
    const { subject } = req.params;
    
    // Get daily breakdown for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const sessions = await PomodoroSession.find({
      user: userId,
      subject: subject,
      completed: true,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });
    
    // Group by day
    const dailyData = {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      last7Days.push(dateKey);
      dailyData[dateKey] = { date: dateKey, minutes: 0, sessions: 0 };
    }
    
    sessions.forEach(session => {
      const dateKey = session.createdAt.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].minutes += (session.duration || 25);
        dailyData[dateKey].sessions += 1;
      }
    });
    
    const chartData = last7Days.map(date => dailyData[date]);
    
    // Get tasks breakdown
    const tasks = await Task.find({
      user: userId,
      subject: subject
    });
    
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    
    res.json({
      success: true,
      data: {
        subject,
        dailyBreakdown: chartData,
        tasks: {
          total: tasks.length,
          completed: completedTasks.length,
          pending: pendingTasks.length
        }
      }
    });
    
  } catch (error) {
    console.error('Subject analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get overall analytics summary
router.get('/summary', protect, async (req, res) => { // ✅ Changed to 'protect'
  try {
    const userId = req.user.id;
    
    // Total study time (all time)
    const allSessions = await PomodoroSession.find({
      user: userId,
      completed: true
    });
    
    const totalMinutes = allSessions.reduce((acc, s) => acc + (s.duration || 25), 0);
    
    // This week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySessions = await PomodoroSession.find({
      user: userId,
      completed: true,
      createdAt: { $gte: oneWeekAgo }
    });
    
    const weeklyMinutes = weeklySessions.reduce((acc, s) => acc + (s.duration || 25), 0);
    
    // Tasks
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, completed: true });
    const weeklyCompletedTasks = await Task.countDocuments({
      user: userId,
      completed: true,
      completedAt: { $gte: oneWeekAgo }
    });
    
    // Most studied subject
    const subjectStats = await PomodoroSession.aggregate([
      { $match: { user: userId, completed: true } },
      { $group: { _id: '$subject', totalMinutes: { $sum: '$duration' }, count: { $sum: 1 } } },
      { $sort: { totalMinutes: -1 } },
      { $limit: 1 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalStudyHours: (totalMinutes / 60).toFixed(2),
        weeklyStudyHours: (weeklyMinutes / 60).toFixed(2),
        totalTasks,
        completedTasks,
        weeklyCompletedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
        mostStudiedSubject: subjectStats.length > 0 ? {
          name: subjectStats[0]._id,
          hours: (subjectStats[0].totalMinutes / 60).toFixed(2),
          sessions: subjectStats[0].count
        } : null
      }
    });
    
  } catch (error) {
    console.error('Summary analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;