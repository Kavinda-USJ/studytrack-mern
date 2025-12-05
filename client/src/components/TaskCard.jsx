import { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import EditTaskModal from './EditTaskModal';

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
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

  return (
    <>
      <div className={`card p-6 hover:shadow-xl transition-all ${task.completed ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="mt-1 w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary cursor-pointer"
          />

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    task.completed ? 'line-through text-gray-500' : 'text-white'
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-400 mt-1">{task.description}</p>
              </div>

              {/* Priority Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                📚 {task.subject}
              </span>
              <span className="flex items-center gap-2">
                📅 {formatDate(task.deadline)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal task={task} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};

export default TaskCard;