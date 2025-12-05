import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ ADD THIS - Refresh user data when dashboard loads
  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400 mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/tasks')}
                className="px-6 py-2 bg-primary hover:bg-secondary rounded-lg transition-all"
              >
                My Tasks
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium">Total Study Time</h3>
            <p className="text-3xl font-bold text-primary mt-2">
              {user?.totalStudyTime || 0} min
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium">Tasks Completed</h3>
            <p className="text-3xl font-bold text-secondary mt-2">
              {user?.tasksCompleted || 0}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium">Weekly Study</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {user?.weeklyStudyTime || 0} min
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-300 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/tasks')}
              className="p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-left"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-lg font-semibold">Manage Tasks</h3>
              <p className="text-gray-400 text-sm mt-1">Add, edit, and track your tasks</p>
            </button>
            <button className="p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-left opacity-50 cursor-not-allowed">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="text-lg font-semibold">Pomodoro Timer</h3>
              <p className="text-gray-400 text-sm mt-1">Coming soon...</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;