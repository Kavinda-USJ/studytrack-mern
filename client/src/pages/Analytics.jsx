import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BookOpen, Clock, CheckCircle, TrendingUp, Calendar, Target } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const Analytics = () => {
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch all analytics data
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError('Please login to view analytics');
        setLoading(false);
        return;
      }

      // Fetch subject analytics
      const subjectsRes = await fetch(`${API_URL}/analytics/subjects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch summary
      const summaryRes = await fetch(`${API_URL}/analytics/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!subjectsRes.ok || !summaryRes.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const subjectsData = await subjectsRes.json();
      const summaryData = await summaryRes.json();

      setSubjectAnalytics(subjectsData.data || []);
      setSummary(summaryData.data || {});
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch detailed subject analytics
  const fetchSubjectDetails = async (subject) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/analytics/subjects/${encodeURIComponent(subject)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch subject details');

      const data = await res.json();
      setSubjectDetails(data.data);
      setSelectedSubject(subject);
    } catch (err) {
      console.error('Error fetching subject details:', err);
    }
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-600">Track your study performance and progress</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" />
                <span className="text-sm opacity-90">Total</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary.totalStudyHours}h</h3>
              <p className="text-blue-100 text-sm">Total Study Time</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8" />
                <span className="text-sm opacity-90">This Week</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary.weeklyStudyHours}h</h3>
              <p className="text-green-100 text-sm">Weekly Study Time</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8" />
                <span className="text-sm opacity-90">Progress</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary.completedTasks}/{summary.totalTasks}</h3>
              <p className="text-purple-100 text-sm">Tasks Completed ({summary.completionRate}%)</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8" />
                <span className="text-sm opacity-90">This Week</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary.weeklyCompletedTasks}</h3>
              <p className="text-orange-100 text-sm">Weekly Tasks Done</p>
            </div>
          </div>
        )}

        {/* Most Studied Subject */}
        {summary?.mostStudiedSubject && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Most Studied Subject</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{summary.mostStudiedSubject.name}</h3>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="ml-2 font-semibold text-blue-600">{summary.mostStudiedSubject.hours}h</span>
                </div>
                <div>
                  <span className="text-gray-600">Sessions:</span>
                  <span className="ml-2 font-semibold text-purple-600">{summary.mostStudiedSubject.sessions}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Study Time Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Study Time by Subject
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalStudyHours" fill="#3b82f6" name="Hours Studied" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Task Completion Rate
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectAnalytics}
                  dataKey="completionRate"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.subject}: ${entry.completionRate}%`}
                >
                  {subjectAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subject Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectAnalytics.map((subject, index) => (
              <div
                key={subject.subject}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => fetchSubjectDetails(subject.subject)}
              >
                <div className={`h-2 bg-gradient-to-r`} style={{ background: COLORS[index % COLORS.length] }}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{subject.subject}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Study Time</span>
                      <span className="font-semibold text-blue-600">{subject.totalStudyHours}h</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Tasks Completed</span>
                      <span className="font-semibold text-green-600">{subject.tasksCompleted}/{subject.totalTasks}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Completion Rate</span>
                      <span className="font-semibold text-purple-600">{subject.completionRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Pomodoros</span>
                      <span className="font-semibold text-orange-600">{subject.pomodoroCount}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">This Week:</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{subject.weeklyStudyHours}h studied</span>
                        <span className="text-gray-600">{subject.weeklyTasksCompleted} tasks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Subject View Modal */}
        {selectedSubject && subjectDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSubject(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSubject} - Detailed Analytics</h2>
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Daily Breakdown Chart */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days Study Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={subjectDetails.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="minutes" stroke="#3b82f6" strokeWidth={2} name="Minutes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Task Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-blue-600 text-2xl font-bold">{subjectDetails.tasks.total}</p>
                    <p className="text-blue-800 text-sm">Total Tasks</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-green-600 text-2xl font-bold">{subjectDetails.tasks.completed}</p>
                    <p className="text-green-800 text-sm">Completed</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-orange-600 text-2xl font-bold">{subjectDetails.tasks.pending}</p>
                    <p className="text-orange-800 text-sm">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;