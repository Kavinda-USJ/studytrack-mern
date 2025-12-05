import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { motion } from 'framer-motion';
import AddTaskModal from '../components/AddTaskModal';
import TaskCard from '../components/TaskCard';
import { 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  LayoutList,
  ArrowLeft,
  Search
} from 'lucide-react';

const Tasks = () => {
  const { tasks, loading } = useContext(TaskContext);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      filter === 'pending' ? !task.completed : true;
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { id: 'all', label: 'All Tasks', count: tasks.length, icon: LayoutList },
    { id: 'pending', label: 'Pending', count: tasks.filter(t => !t.completed).length, icon: Clock },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
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
                  My Tasks
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {tasks.length} total • {tasks.filter((t) => t.completed).length} completed
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
              Add New Task
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="input-field pl-12"
            />
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all border ${
                  filter === option.id
                    ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <option.icon className="w-4 h-4 inline mr-2" />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="ml-1">({option.count})</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner w-12 h-12"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
              <LayoutList className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 text-lg mb-2">
              {searchQuery ? 'No tasks found matching your search' : 
               filter === 'all' ? 'No tasks yet. Create your first task!' :
               `No ${filter} tasks`}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-6 py-2.5 bg-primary-500/20 border border-primary-500/40 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-all"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Your First Task
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard task={task} />
              </motion.div>
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