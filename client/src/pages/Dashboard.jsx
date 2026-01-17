import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Timer, 
  LogOut,
  Target,
  BarChart3
} from 'lucide-react';
import AIAssistant from '../components/AIAssistant'; // ✅ ADD THIS LINE

const Dashboard = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    {
      label: 'Total Study Time',
      value: `${user?.totalStudyTime || 0} min`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Tasks Completed',
      value: user?.tasksCompleted || 0,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Weekly Progress',
      value: `${user?.weeklyStudyTime || 0} min`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Tasks',
      description: 'Add, edit, and track your tasks',
      icon: BookOpen,
      action: () => navigate('/tasks'),
      color: 'from-indigo-500 to-purple-500',
      disabled: false,
    },
    {
      title: 'Pomodoro Timer',
      description: 'Focus with 25-minute sessions',
      icon: Timer,
      action: () => navigate('/pomodoro'),
      color: 'from-orange-500 to-red-500',
      disabled: false,
    },
    {
      title: 'Set Goals',
      description: 'Define and track your study goals',
      icon: Target,
      action: () => navigate('/goals'),
      color: 'from-pink-500 to-rose-500',
      disabled: false,
    },
    {
      title: 'View Analytics',
      description: 'Track your study performance',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'from-blue-500 to-indigo-500',
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-secondary"
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                My Tasks
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`stats-card ${stat.bgColor} border ${stat.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: action.disabled ? 1 : 1.03 }}
                whileTap={{ scale: action.disabled ? 1 : 0.98 }}
                onClick={action.action}
                disabled={action.disabled}
                className={`p-6 rounded-xl text-left transition-all border ${
                  action.disabled
                    ? 'bg-gray-800/30 border-gray-700/50 opacity-50 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ✅ AI ASSISTANT - ADD THIS COMPONENT */}
        <AIAssistant />

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-card p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 mb-2">No recent activity yet</p>
            <p className="text-sm text-gray-500">
              Start adding tasks and tracking your study sessions!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;