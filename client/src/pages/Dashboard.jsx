import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>

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

        <div className="card p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-300">
            More features coming soon! 🚀
          </h2>
          <p className="text-gray-400 mt-2">
            Tasks, Pomodoro Timer, Analytics, and more...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;