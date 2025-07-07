import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Signup from './components/Signup'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import TeacherDashboard from './components/teacher/TeacherDashboard'
import StudentDashboard from './components/student/StudentDashboard'
import SubjectView from './components/student/SubjectView'
import ChapterView from './components/student/ChapterView'
import SubchapterView from './components/student/SubchapterView'
import QuizView from './components/student/QuizView'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Routes protégées */}
            <Route 
              path="/welcome" 
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes professeur */}
            <Route 
              path="/professor/dashboard" 
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes élève */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/subject/:subjectId" 
              element={
                <ProtectedRoute>
                  <SubjectView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/chapter/:chapterId" 
              element={
                <ProtectedRoute>
                  <ChapterView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/subchapter/:subchapterId" 
              element={
                <ProtectedRoute>
                  <SubchapterView />
                </ProtectedRoute>
              } 
            />
            // Ajouter la route dans les Routes
<Route 
  path="/student/quiz/:quizId" 
  element={
    <ProtectedRoute>
      <QuizView />
    </ProtectedRoute>
  } 
/>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
