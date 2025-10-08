import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { app } from '@/lib/firebase';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // Verify Firebase initialization (development only)
  if (import.meta.env.DEV) {
    console.warn('Firebase initialized:', app.name);
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page - public */}
          <Route path="/" element={<Landing />} />

          {/* Public routes - redirect to dashboard if authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
