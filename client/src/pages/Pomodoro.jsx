import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  Coffee,
  Timer as TimerIcon,
  BookOpen,
  TrendingUp,
  Check,
  X
} from 'lucide-react';

const Pomodoro = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  
  // Session tracking
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);

  // Common subjects
  const commonSubjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Programming',
    'Language Learning',
  ];

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      // Focus session completed
      const duration = 25;
      const newSession = {
        subject: selectedSubject || customSubject || 'General Study',
        duration,
        startTime: sessionStartTime,
        endTime: new Date(),
        type: 'focus'
      };
      
      setTodaySessions([...todaySessions, newSession]);
      setSessions(sessions + 1);
      
      // Save to backend (you'll need to create this API endpoint)
      saveSessionToBackend(newSession);
      
      // Show completion notification
      showNotification('Focus session completed! 🎉', 'Take a break');
      
      // Start break
      setIsBreak(true);
      setMinutes(5);
      setSeconds(0);
    } else {
      // Break completed
      showNotification('Break completed! ☕', 'Ready for another session?');
      setIsBreak(false);
      setMinutes(25);
      setSeconds(0);
    }
  };

  const saveSessionToBackend = async (session) => {
    // TODO: Implement API call to save session
    console.log('Saving session:', session);
    // This will be implemented when we create the backend endpoint
  };

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const startTimer = () => {
    if (!isBreak && !selectedSubject && !customSubject) {
      setShowSubjectModal(true);
      return;
    }
    
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const skipToBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setMinutes(5);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const skipBreak = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalStudyTime = () => {
    return todaySessions.reduce((total, session) => total + session.duration, 0);
  };

  const progress = isBreak
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Pomodoro Timer
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Stay focused with 25-minute sessions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 md:p-12"
            >
              {/* Timer Display */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  className="relative inline-block"
                >
                  {/* Circular Progress */}
                  <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke={isBreak ? '#10b981' : '#6366f1'}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s' }}
                    />
                  </svg>

                  {/* Time Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                      {formatTime(minutes, seconds)}
                    </div>
                    <div className="flex items-center gap-2 text-lg text-gray-400">
                      {isBreak ? (
                        <>
                          <Coffee className="w-5 h-5" />
                          <span>Break Time</span>
                        </>
                      ) : (
                        <>
                          <TimerIcon className="w-5 h-5" />
                          <span>Focus Time</span>
                        </>
                      )}
                    </div>
                    {!isBreak && (selectedSubject || customSubject) && (
                      <div className="mt-3 px-4 py-1.5 bg-white/10 rounded-full">
                        <span className="text-sm text-gray-300">
                          {selectedSubject || customSubject}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isActive ? pauseTimer : startTimer}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                    isActive
                      ? 'bg-yellow-500/20 border-2 border-yellow-500/40 text-yellow-300'
                      : 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-6 h-6 inline mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 inline mr-2" />
                      Start
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center gap-3">
                {!isBreak && isActive && (
                  <button
                    onClick={skipToBreak}
                    className="px-4 py-2 text-sm bg-green-500/20 border border-green-500/40 text-green-300 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    Skip to Break
                  </button>
                )}
                {isBreak && (
                  <button
                    onClick={skipBreak}
                    className="px-4 py-2 text-sm bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    Skip Break
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Today's Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Sessions Completed</span>
                    <span className="text-white font-semibold">{sessions}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sessions / 8) * 100}%` }}
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Total Study Time</span>
                    <span className="text-white font-semibold">{getTotalStudyTime()} min</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(getTotalStudyTime() / 200) * 100}%` }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Session History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                {todaySessions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No sessions completed yet
                  </p>
                ) : (
                  todaySessions.slice(-5).reverse().map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{session.subject}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(session.endTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{session.duration}m</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subject Selection Modal */}
      <AnimatePresence>
        {showSubjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Select Subject</h2>
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {commonSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setCustomSubject('');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedSubject === subject
                          ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 mb-2" />
                      <span className="text-sm font-medium">{subject}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Or enter custom subject:
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => {
                      setCustomSubject(e.target.value);
                      setSelectedSubject('');
                    }}
                    placeholder="e.g., Physics Chapter 5"
                    className="input-field"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedSubject || customSubject) {
                    setShowSubjectModal(false);
                    setSessionStartTime(new Date());
                    setIsActive(true);
                  }
                }}
                disabled={!selectedSubject && !customSubject}
                className="btn-primary"
              >
                Start Studying
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pomodoro;