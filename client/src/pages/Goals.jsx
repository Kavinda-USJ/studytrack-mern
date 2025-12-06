import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalContext } from '../context/GoalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  Calendar,
  Clock,
  Flame,
  BookOpen,
  CheckCircle2,
  Trophy,
  Star,
  X,
  Edit3,
  Trash2,
  BarChart3
} from 'lucide-react';

const Goals = () => {
  const { 
    goals, 
    loading, 
    stats,
    createGoal, 
    updateGoal, 
    deleteGoal 
  } = useContext(GoalContext);
  
  const navigate = useNavigate();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // New goal form
  const [newGoal, setNewGoal] = useState({
    type: 'daily',
    title: '',
    target: '',
    unit: 'minutes',
    description: ''
  });

  const goalTypes = [
    { 
      id: 'daily', 
      label: 'Daily Goal', 
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      units: ['minutes', 'tasks', 'sessions'],
      description: 'Complete by end of today'
    },
    { 
      id: 'weekly', 
      label: 'Weekly Goal', 
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      units: ['minutes', 'tasks', 'sessions'],
      description: 'Complete within 7 days'
    },
    { 
      id: 'streak', 
      label: 'Streak Goal', 
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      units: ['days'],
      description: 'Maintain daily consistency'
    },
    { 
      id: 'subject', 
      label: 'Subject Goal', 
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      units: ['minutes', 'tasks'],
      description: 'Master a specific subject'
    },
    { 
      id: 'custom', 
      label: 'Custom Goal', 
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      units: ['custom'],
      description: 'Your personalized target'
    }
  ];

  const getIconForType = (type) => {
    return goalTypes.find(t => t.id === type)?.icon || Target;
  };

  const getColorForType = (type) => {
    return goalTypes.find(t => t.id === type)?.color || 'from-blue-500 to-cyan-500';
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.active && goal.current < goal.target;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getDaysRemaining = (endDate) => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleAddGoal = async () => {
    console.log('🎯 handleAddGoal called');
    console.log('📝 Form data:', newGoal);
    
    // Clear previous errors
    setError('');
    
    // Validation
    if (!newGoal.title || !newGoal.title.trim()) {
      setError('Please enter a goal title');
      console.log('❌ Validation failed: No title');
      return;
    }

    if (!newGoal.target || parseInt(newGoal.target) <= 0) {
      setError('Please enter a valid target amount (greater than 0)');
      console.log('❌ Validation failed: Invalid target');
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 Submitting goal...');

    try {
      const goalData = {
        type: newGoal.type,
        title: newGoal.title.trim(),
        target: parseInt(newGoal.target),
        unit: newGoal.unit,
        description: newGoal.description.trim(),
      };

      console.log('📤 Sending data:', goalData);

      const result = await createGoal(goalData);
      
      console.log('📥 Result:', result);

      if (result.success) {
        console.log('✅ Goal created successfully!');
        setShowAddModal(false);
        setNewGoal({ type: 'daily', title: '', target: '', unit: 'minutes', description: '' });
        setError('');
      } else {
        console.log('❌ Goal creation failed:', result.message);
        setError(result.message || 'Failed to create goal. Please try again.');
      }
    } catch (err) {
      console.error('💥 Error in handleAddGoal:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const result = await deleteGoal(goalId);
      if (!result.success) {
        alert(result.message || 'Failed to delete goal');
      }
    }
  };

  const statsData = [
    {
      label: 'Active Goals',
      value: stats?.activeGoals || 0,
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Completed',
      value: stats?.completedGoals || 0,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    }
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Goals & Progress
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Set targets and track your achievements
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="btn-primary w-full md:w-auto"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create New Goal
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stats-card"
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-6"
        >
          {[
            { id: 'active', label: 'Active', count: goals.filter(g => g.active && !g.completed).length },
            { id: 'completed', label: 'Completed', count: goals.filter(g => g.completed).length },
            { id: 'all', label: 'All Goals', count: goals.length }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all border ${
                filter === f.id
                  ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </motion.div>

        {/* Goals Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner w-12 h-12"></div>
          </div>
        ) : filteredGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 text-lg mb-2">
              {filter === 'completed' ? 'No completed goals yet' : 'No active goals'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2.5 bg-primary-500/20 border border-primary-500/40 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-all"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Your First Goal
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGoals.map((goal, index) => {
              const progress = calculateProgress(goal.current, goal.target);
              const isCompleted = goal.completed;
              const daysRemaining = getDaysRemaining(goal.endDate);
              const GoalIcon = getIconForType(goal.type);
              const goalColor = getColorForType(goal.type);

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 relative overflow-hidden"
                >
                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full">
                        <Trophy className="w-4 h-4 text-green-300" />
                        <span className="text-xs font-semibold text-green-300">Completed!</span>
                      </div>
                    </div>
                  )}

                  {/* Icon & Type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goalColor} flex items-center justify-center`}>
                        <GoalIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {goal.type} Goal
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {goal.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-semibold">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full relative`}
                      >
                        {progress > 10 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                            {Math.round(progress)}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{daysRemaining} days remaining</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      progress >= 75 
                        ? 'bg-green-500/20 text-green-300'
                        : progress >= 50
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {progress >= 75 ? 'On Track' : progress >= 50 ? 'In Progress' : 'Behind'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg transition-all text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Analytics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Goal Analytics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Average Completion Rate</p>
                <p className="text-3xl font-bold text-white">{stats.averageProgress}%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Total Goals</p>
                <p className="text-3xl font-bold text-white">{stats.totalGoals}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-6">
                {/* Goal Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Goal Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setNewGoal({ ...newGoal, type: type.id, unit: type.units[0] })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          newGoal.type === type.id
                            ? 'bg-primary-500/20 border-primary-500/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <type.icon className="w-6 h-6 mb-2 text-white" />
                        <p className="text-sm font-semibold text-white mb-1">{type.label}</p>
                        <p className="text-xs text-gray-400">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Study 2 hours daily"
                    className="input-field"
                  />
                </div>

                {/* Target & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="100"
                      className="input-field"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unit
                    </label>
                    <select
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      className="input-field"
                    >
                      {goalTypes.find(t => t.id === newGoal.type)?.units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add more details about this goal..."
                    className="input-field"
                    rows="3"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleAddGoal}
                  disabled={isSubmitting || !newGoal.title || !newGoal.target}
                  className="btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5 inline mr-2 border-white"></div>
                      Creating Goal...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 inline mr-2" />
                      Create Goal
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;