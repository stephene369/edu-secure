import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Signup from './components/Signup'
import Welcome from './components/Welcome'
import HowItWorks from './components/welcome/HowItWorks.jsx'
import StudentDashboard from './components/student/StudentDashboard'
import SubjectView from './components/student/SubjectView'
import ChapterView from './components/student/ChapterView'
import SubchapterView from './components/student/SubchapterView'
import QuizView from './components/student/QuizView'
import ForTeachers from './components/welcome/ForTeachers.jsx'
import { CourseCatalog } from './components/welcome/CourseCatalog.jsx'
import { SimulationHub } from './components/welcome/SimulationHub.jsx'

import TeacherDashboard from './pages/teacher/Dashboard'
import AddSubject from './pages/teacher/AddSubject'
import ManageSubjects from './pages/teacher/ManageSubjects'
import AddLesson from './pages/teacher/AddLesson'
import CreateQuiz from './pages/teacher/CreateQuiz'
import Quizzes from './pages/teacher/Quizzes.jsx'
import ManageChapters from './pages/teacher/ManageChapters.jsx'
import AddChapter from './pages/teacher/AddChapter.jsx'
import AddSubchapter from './pages/teacher/AddSubchapter.jsx'
import ManageSubchapters from './pages/teacher/ManageSubchaptersBulk.jsx'

import './App.css'
import Students from './pages/teacher/Students.jsx'
import Support from './pages/teacher/Support.jsx'
import Documentation from './pages/teacher/Documentation.jsx'
import Settings from './pages/teacher/Settings.jsx'
import ManageLessons from './pages/teacher/Lessons.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            <Route path="/course-catalog" element={<CourseCatalog />} />
            <Route path="/simulation-hub" element={<SimulationHub />} />
            
            {/* Routes protégées */}
            
            {/* Routes professeur */}
        
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-subject" element={<AddSubject />} />
        <Route path="/teacher/manage-subjects" element={<ManageSubjects />} />
        <Route path="/teacher/add-lesson" element={<AddLesson />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path='/teacher/quizzes' element={<Quizzes />} />
        <Route path='/teacher/students' element={<Students />} />
        <Route path='/teacher/lessons' element={<ManageLessons />} />
        <Route path='/teacher/settings' element={<Settings />} />
        <Route path='/teacher/add-chapter' element={<AddChapter />} />

        <Route path='/teacher/add-subchapters' element={<AddSubchapter />} />
        <Route path='/teacher/manage-subchapters' element={<ManageSubchapters />} />

        <Route path='/teacher/manage-chapters' element={<ManageChapters />} />

        <Route path='/docs' element={<Documentation />} />
        <Route path='/support' element={<Support />} />


        


            
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
