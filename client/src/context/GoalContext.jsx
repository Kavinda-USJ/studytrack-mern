import { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from './AuthContext';

export const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all goals
  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data } = await API.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch goal statistics
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const { data } = await API.get('/goals/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Create goal
  const createGoal = async (goalData) => {
    try {
      const { data } = await API.post('/goals', goalData);
      setGoals([data, ...goals]);
      fetchStats(); // Update stats
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create goal',
      };
    }
  };

  // Update goal
  const updateGoal = async (id, goalData) => {
    try {
      const { data } = await API.put(`/goals/${id}`, goalData);
      setGoals(goals.map((goal) => (goal._id === id ? data : goal)));
      fetchStats();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update goal',
      };
    }
  };

  // Update goal progress
  const updateGoalProgress = async (id, increment = 1) => {
    try {
      const { data } = await API.put(`/goals/${id}/progress`, { increment });
      setGoals(goals.map((goal) => (goal._id === id ? data : goal)));
      fetchStats();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update progress',
      };
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      setGoals(goals.filter((goal) => goal._id !== id));
      fetchStats();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete goal',
      };
    }
  };

  // Toggle goal active status
  const toggleGoalActive = async (id) => {
    try {
      const { data } = await API.put(`/goals/${id}/toggle`);
      setGoals(goals.map((goal) => (goal._id === id ? data : goal)));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle goal',
      };
    }
  };

  // Auto-update goals based on user activity
  const checkAndUpdateGoals = async (activityType, amount = 1, subject = null) => {
    // This function will be called when user completes tasks/pomodoro sessions
    // It automatically updates relevant goals
    
    const relevantGoals = goals.filter(goal => {
      if (!goal.active || goal.completed) return false;
      
      // Match activity type with goal unit
      if (activityType === 'task' && goal.unit === 'tasks') return true;
      if (activityType === 'session' && goal.unit === 'sessions') return true;
      if (activityType === 'minutes' && goal.unit === 'minutes') return true;
      
      // Subject-specific goals
      if (goal.type === 'subject' && goal.subject === subject) return true;
      
      return false;
    });

    // Update all relevant goals
    for (const goal of relevantGoals) {
      await updateGoalProgress(goal._id, amount);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
      fetchStats();
    }
  }, [user]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        loading,
        stats,
        fetchGoals,
        fetchStats,
        createGoal,
        updateGoal,
        updateGoalProgress,
        deleteGoal,
        toggleGoalActive,
        checkAndUpdateGoals,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};