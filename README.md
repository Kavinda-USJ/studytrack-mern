# studytrack-mern

🚀 StudyTrack — Smart Productivity for Students

StudyTrack is a high-performance, modern MERN stack application designed to revolutionize how students manage their academic life. Featuring a stunning glassmorphism UI, dynamic animations, and powerful tracking tools, StudyTrack helps students stay focused, organized, and motivated.

✨ Key Features

📅 Smart Study Planner

Task Management: Create, edit, and categorize tasks by subject.

Priority System: Visual indicators for Low, Medium, and High priority items.

Status Tracking: Keep track of "Pending," "In Progress," and "Completed" states.

⏱️ Pomodoro Engine

Focus Cycles: Deep work sessions (25 min) and rejuvenation breaks (5 min).

Auto-Logging: Every second of focus is automatically logged and attributed to specific subjects for accurate analytics.

📊 Performance Dashboard

Visual Analytics: Real-time charts showing study distribution across subjects using Recharts/Chart.js.

Study Streaks: Gamified streak tracking to build long-term consistency.

Weekly Progress: Comparative analysis of current vs. previous week's performance.

🎨 Premium UI/UX

Modern Glassmorphism: A sophisticated interface using translucent layers and vibrant gradients.

Dynamic Animations: Smooth transitions and floating background elements powered by Framer Motion.

Full Responsiveness: Seamless experience across mobile, tablet, and desktop devices.

🛠️ Tech Stack

Frontend

React.js: Component-based architecture.

Tailwind CSS: Utility-first styling with custom glassmorphism extensions.

Framer Motion: Fluid, physics-based animations.

Lucide React: Clean, professional iconography.

Backend

Node.js & Express: Scalable RESTful API architecture.

MongoDB & Mongoose: Flexible NoSQL data modeling.

JWT (JSON Web Tokens): Secure, stateless authentication.

Bcrypt: Industry-standard password hashing.

🚀 Getting Started

1. Prerequisites

Node.js (v16+)

MongoDB Atlas account or local installation

NPM or Yarn

2. Installation

Clone the repository:

git clone [https://github.com/your-username/studytrack.git](https://github.com/your-username/studytrack.git)
cd studytrack

Setup Backend:

cd backend
npm install

# Create a .env file with: MONGO_URI, JWT_SECRET, PORT

npm start

Setup Frontend:

cd frontend
npm install
npm run dev

📁 Project Structure

StudyTrack/
├── backend/ # Express server, API routes, and Mongoose models
│ ├── models/ # Database schemas (User, Task, Subject, Session)
│ ├── routes/ # API endpoints
│ └── middleware/ # Auth and validation logic
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth and Theme context
│ │ ├── pages/ # Dashboard, Planner, Login/Register
│ │ └── assets/ # Global styles and constants
└── README.md

🌟 Future Roadmap

[ ] AI Study Suggestions: Intelligent task prioritization based on performance data.

[ ] Friend Leaderboards: Competitive study tracking with peers.

[ ] PDF Export: Generate weekly performance reports for parents or mentors.

[ ] Google Calendar Sync: Export task deadlines to external calendars.

👥 Contributors

You — Lead Developer / UI Architect

Your Friend — Full-stack Developer / Backend Logic

Built with ❤️ for better learning.
