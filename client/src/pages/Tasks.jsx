import { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
  const { tasks, loading } = useContext(TaskContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-gray-400 mt-2">
              {tasks.length} total tasks • {tasks.filter((t) => t.completed).length} completed
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
          >
            + Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'pending'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Pending ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">
              {filter === 'all'
                ? 'No tasks yet. Create your first task!'
                : `No ${filter} tasks`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
};

export default Tasks;