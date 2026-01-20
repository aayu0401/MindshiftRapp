import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import CrisisButton from './components/CrisisButton';

// Public Pages
import MindshiftRLanding from './components/MindshiftRLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Stories from './pages/Stories';
import StoryReader from './pages/StoryReader';
import About from './pages/About';
import FAQPage from './pages/FAQPage';
import Courses from './pages/Courses';
import Assessments from './pages/Assessments';
import Assessment from './pages/Assessment';
import CrisisSupport from './pages/CrisisSupport';

// Protected Pages
import Dashboard from './pages/Dashboard';
import AIStoryCreator from './pages/AIStoryCreator';
import ParentPortal from './pages/ParentPortal';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MindshiftRLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:id" element={<StoryReader />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/assessment/:id" element={<Assessment />} />
          <Route path="/crisis-support" element={<CrisisSupport />} />

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
              <ProtectedRoute>
                <ParentPortal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}
