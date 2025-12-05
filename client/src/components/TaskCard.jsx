import { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import EditTaskModal from './EditTaskModal';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Check,
  AlertCircle 
} from 'lucide-react';

const TaskCard = ({ task }) => {
  const { toggleComplete, deleteTask } = useContext(TaskContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggle = async () => {
    await toggleComplete(task._id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-red-500/20 border-red-500/40 text-red-300',
          icon: 'bg-gradient-to-br from-red-500 to-orange-500',
        };
      case 'medium':
        return {
          badge: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
          icon: 'bg-gradient-to-br from-yellow-500 to-orange-500',
        };
      case 'low':
        return {
          badge: 'bg-green-500/20 border-green-500/40 text-green-300',
          icon: 'bg-gradient-to-br from-green-500 to-emerald-500',
        };
      default:
        return {
          badge: 'bg-gray-500/20 border-gray-500/40 text-gray-300',
          icon: 'bg-gradient-to-br from-gray-500 to-slate-500',
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`glass-card p-6 transition-all ${
          task.completed ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500'
                : 'border-gray-600 hover:border-primary-500'
            }`}
          >
            {task.completed && <Check className="w-4 h-4 text-white" />}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    task.completed
                      ? 'line-through text-gray-500'
                      : 'text-white'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Priority Badge */}
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold border uppercase whitespace-nowrap ${priorityConfig.badge}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{task.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.deadline)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 rounded-lg transition-all text-sm font-medium"
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal task={task} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};

export default TaskCard;