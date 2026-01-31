import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddTaskModal = ({ onClose, onTaskAdded }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customSubject, setCustomSubject] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    deadline: '',
    priority: 'medium',
  });

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Validate deadline - check if it's in the past
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      // Make API call to create task
      const response = await axios.post(
        'http://localhost:3001/api/tasks',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Task created successfully!');
      
      // Call parent callback to refresh task list
      if (onTaskAdded) {
        onTaskAdded(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      
      // Handle backend validation errors
      if (error.response?.data?.message) {
        if (error.response.data.field === 'deadline') {
          setErrors({ deadline: error.response.data.message });
        }
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
      } else {
        toast.error('Failed to create task');
      }
    } finally {
      setLoading(false);
    }
  };

  const predefinedSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Data Management',
    'Quality Engineering',
    'High Performance Computing',
    'Combined Maths',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Add New Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Assignment 1"
                className={`input-field ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </motion.p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Subject <span className="text-red-400">*</span>
              </label>
              
              {/* Toggle between dropdown and custom input */}
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCustomSubject(false)}
                  className={`px-3 py-1.5 text-xs rounded ${
                    !customSubject 
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' 
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  Select from list
                </button>
                <button
                  type="button"
                  onClick={() => setCustomSubject(true)}
                  className={`px-3 py-1.5 text-xs rounded ${
                    customSubject 
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' 
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  Enter custom
                </button>
              </div>

              {customSubject ? (
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter custom subject"
                  className={`input-field ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              ) : (
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input-field ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                >
                  <option value="">Select a subject</option>
                  {predefinedSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              )}
              
              {errors.subject && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.subject}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any additional details..."
                rows="3"
                className="input-field resize-none"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={getTodayDate()}
                className={`input-field ${errors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.deadline && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.deadline}
                </motion.p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      formData.priority === priority
                        ? priority === 'high'
                          ? 'bg-red-500/20 border-red-500/40 text-red-300 border'
                          : priority === 'medium'
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 border'
                          : 'bg-green-500/20 border-green-500/40 text-green-300 border'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 border'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 border-2 inline mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskModal;