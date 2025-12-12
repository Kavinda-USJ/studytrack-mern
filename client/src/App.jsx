import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { GoalProvider } from './context/GoalContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import Goals from './pages/Goals';
import Calendar from "./pages/Calendar";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <GoalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pomodoro"
                element={
                  <ProtectedRoute>
                    <Pomodoro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />
              <Route
               path="/calendar" 
               element={
                <ProtectedRoute>
                  <Calendar />
                  </ProtectedRoute>
               } 
              />
            </Routes>
          </Router>
        </GoalProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;