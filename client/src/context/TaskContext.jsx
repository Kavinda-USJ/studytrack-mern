import { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useContext(AuthContext); // ✅ Add refreshUser

  // Fetch all tasks
  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      const { data } = await API.post('/tasks', taskData);
      setTasks([data, ...tasks]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create task',
      };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update task',
      };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete task',
      };
    }
  };

  // Toggle complete
  const toggleComplete = async (id) => {
    try {
      const { data } = await API.put(`/tasks/${id}/complete`);
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
      
      // ✅ ADD THIS - Refresh user data to update task count
      await refreshUser();
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle task',
      };
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};