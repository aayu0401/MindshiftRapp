import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import CrisisButton from './components/CrisisButton'
import ZenBot from './components/ZenBot'

// Public Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Stories from './pages/Stories'
import StoryReader from './pages/StoryReader'
import About from './pages/About'
import FAQPage from './pages/FAQPage'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Assessments from './pages/Assessments'
import Assessment from './pages/Assessment'
import CrisisSupport from './pages/CrisisSupport'
import DailyInspiration from './pages/DailyInspiration'
import MindshiftRLanding from './components/MindshiftRLanding'

// Protected Pages
import Dashboard from './pages/Dashboard'
import AIStoryCreator from './pages/AIStoryCreator'
import ParentPortal from './pages/ParentPortal'
import StudentPortal from './pages/StudentPortal'
import StoryQuiz from './pages/StoryQuiz'
import SchoolAdmin from './pages/SchoolAdmin'

import { RealtimeProvider } from './context/RealtimeContext'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RealtimeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#152844',
                color: '#fff',
                border: '1px solid rgba(0, 212, 170, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#00d4aa',
                  secondary: '#fff',
                },
              },
            }}
          />
          <CrisisButton />
          <ZenBot />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MindshiftRLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story/:id" element={<StoryReader />} />
            <Route path="/story/:id/quiz" element={<StoryQuiz />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessment/:id" element={<Assessment />} />
            <Route path="/crisis-support" element={<CrisisSupport />} />
            <Route path="/daily-inspiration" element={<DailyInspiration />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'school']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-creator"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'school']}>
                  <AIStoryCreator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent-portal"
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <ParentPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-admin"
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </RealtimeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
