# 📚 StudyTrack - Smart Study Management Platform

A modern, full-stack MERN application designed to help students manage their academic life through smart study planning, time tracking, goal management, and AI-powered study assistance.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express%205.2-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.0-47A248?style=flat&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss)

## ✨ Features

### 🔐 User Authentication

- Secure registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and session management

### ✅ Task Management

- Create, edit, and delete tasks
- Priority levels (low, medium, high)
- Deadline tracking and completion status
- Subject-based organization

### ⏱️ Pomodoro Timer

- 25-minute focus sessions with 5-minute breaks
- Subject-based session tracking
- Session history and daily statistics
- Browser notifications on session completion

### 🎯 Goal Tracking

- Multiple goal types: daily, weekly, streak, subject, custom
- Progress tracking with visual indicators
- Goal activation/deactivation
- Statistics and analytics

### 📅 Calendar & Events

- Event creation with start/end times
- Color-coded events
- All-day event support
- Interactive calendar view

### 📊 Analytics Dashboard

- Subject-wise study time breakdown
- Weekly performance comparison
- Task completion rates
- Most studied subject identification

### 🤖 AI Study Assistant

- Powered by Google Gemini AI
- Question answering for study topics
- AI-generated task breakdowns
- Personalized study tips

## 🛠️ Tech Stack

### Frontend

| Technology         | Version  | Purpose     |
| ------------------ | -------- | ----------- |
| React              | 19.2.0   | UI library  |
| Vite               | -        | Build tool  |
| Tailwind CSS       | 3.4.18   | Styling     |
| Framer Motion      | 12.23.25 | Animations  |
| React Router DOM   | 7.10.0   | Routing     |
| Recharts           | 3.6.0    | Charts      |
| React Big Calendar | 1.19.4   | Calendar    |
| Axios              | 1.13.2   | HTTP client |
| Lucide React       | 0.556.0  | Icons       |

### Backend

| Technology           | Version | Purpose          |
| -------------------- | ------- | ---------------- |
| Node.js              | -       | Runtime          |
| Express              | 5.2.1   | Web framework    |
| MongoDB              | -       | Database         |
| Mongoose             | 9.0.0   | ODM              |
| JWT                  | 9.0.3   | Authentication   |
| Bcrypt               | 3.0.3   | Password hashing |
| Google Generative AI | 0.24.1  | AI features      |

## 📁 Project Structure

```
studytrack-mern/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── AddTaskModal.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TaskContext.jsx
│   │   │   └── GoalContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Pomodoro.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── Analytics.jsx
│   │   ├── Services/           # API service functions
│   │   │   └── aiService.js
│   │   └── utils/
│   │       └── api.js          # Axios configuration
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── goalController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Goal.js
│   │   ├── Event.js
│   │   └── PomodoroSession.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── analytics.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   └── aiService.js        # Gemini AI integration
│   └── server.js               # Entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/studytrack-mern.git
   cd studytrack-mern
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` file in the `server` directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Create `.env` file in the `client` directory:

   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

5. **Start the development servers**

   Backend (from `server` directory):

   ```bash
   npm run dev
   ```

   Frontend (from `client` directory):

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/me`       | Get current user  |

### Tasks

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| GET    | `/api/tasks`              | Get all tasks     |
| GET    | `/api/tasks/:id`          | Get single task   |
| POST   | `/api/tasks`              | Create task       |
| PUT    | `/api/tasks/:id`          | Update task       |
| DELETE | `/api/tasks/:id`          | Delete task       |
| PUT    | `/api/tasks/:id/complete` | Toggle completion |

### Goals

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/goals`              | Get all goals        |
| GET    | `/api/goals/stats`        | Get goal statistics  |
| POST   | `/api/goals`              | Create goal          |
| PUT    | `/api/goals/:id`          | Update goal          |
| PUT    | `/api/goals/:id/progress` | Update progress      |
| PUT    | `/api/goals/:id/toggle`   | Toggle active status |
| DELETE | `/api/goals/:id`          | Delete goal          |

### Events

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/events`     | Get all events |
| POST   | `/api/events`     | Create event   |
| PUT    | `/api/events/:id` | Update event   |
| DELETE | `/api/events/:id` | Delete event   |

### Analytics

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| GET    | `/api/analytics/subjects`          | Subject analytics          |
| GET    | `/api/analytics/subjects/:subject` | Detailed subject analytics |
| GET    | `/api/analytics/summary`           | Overall summary            |

### AI Assistant

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/ai/test`           | Test API connection |
| POST   | `/api/ai/ask`            | Ask a question      |
| POST   | `/api/ai/breakdown-task` | Get task breakdown  |
| POST   | `/api/ai/study-tips`     | Get study tips      |

## 🗄️ Database Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  totalStudyTime: Number,
  tasksCompleted: Number,
  weeklyStudyTime: Number
}
```

### Task

```javascript
{
  user: ObjectId,
  title: String,
  subject: String,
  description: String,
  deadline: Date,
  priority: 'low' | 'medium' | 'high',
  completed: Boolean,
  completedAt: Date
}
```

### Goal

```javascript
{
  user: ObjectId,
  type: 'daily' | 'weekly' | 'streak' | 'subject' | 'custom',
  title: String,
  target: Number,
  current: Number,
  unit: 'minutes' | 'tasks' | 'sessions' | 'days' | 'custom',
  startDate: Date,
  endDate: Date,
  active: Boolean,
  completed: Boolean
}
```

### Event

```javascript
{
  user: ObjectId,
  title: String,
  start: Date,
  end: Date,
  description: String,
  location: String,
  color: String,
  allDay: Boolean
}
```

### PomodoroSession

```javascript
{
  user: ObjectId,
  subject: String,
  duration: Number,
  completed: Boolean,
  startTime: Date,
  endTime: Date,
  notes: String
}
```

## 🎨 UI Design

The application features a modern **glassmorphism** design with:

- Translucent glass-effect cards with backdrop blur
- Gradient backgrounds and text
- Smooth Framer Motion animations
- Responsive layouts for all devices
- Dark theme with vibrant accent colors

### Custom Tailwind Theme

- Extended color palette (primary, secondary, accent, success)
- Custom gradients (primary, secondary, sunset, ocean, forest)
- Box shadows with glow effects
- Custom animations (float, pulse-slow, gradient)

## 📝 Scripts

### Backend

```bash
npm run dev      # Start with nodemon (development)
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features

- JWT-based authentication with token expiration
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with auth middleware
- CORS configuration for cross-origin requests

## 🌟 Future Roadmap

- [ ] AI Study Suggestions based on performance data
- [ ] Friend Leaderboards for competitive study tracking
- [ ] PDF Export for weekly performance reports
- [ ] Google Calendar Sync for task deadlines
- [ ] Mobile app with React Native
- [ ] Dark/Light theme toggle

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini AI](https://ai.google.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Recharts](https://recharts.org/)
- [React Big Calendar](https://jquense.github.io/react-big-calendar/)

---

Made with ❤️ for students everywhere
