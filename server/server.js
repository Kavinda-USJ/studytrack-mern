const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ CORS Configuration - MUST be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 StudyTrack API is running' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
});