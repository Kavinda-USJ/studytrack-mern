const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const analyticsRoutes = require('./routes/analytics');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ Simple CORS - allows all origins (development only)
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.path}`); // ✅ FIXED - parentheses, not backticks
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/goals', require('./routes/goalRoutes')); 
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/analytics', analyticsRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 StudyTrack API is running' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`); // ✅ FIXED
  console.log(`📍 Server URL: http://localhost:${PORT}`); // ✅ FIXED
});