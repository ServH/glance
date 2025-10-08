import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { app } from '@/lib/firebase';
import { AuthProvider } from '@/contexts/AuthContext';
import { WidgetConfigProvider } from '@/contexts/WidgetConfigContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { CommandPalette } from '@/components/CommandPalette';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ClockScreen from './pages/ClockScreen';
import Settings from './pages/Settings';
import PrototypeV2 from './pages/prototypes/PrototypeV2';
import PrototypeV3 from './pages/prototypes/PrototypeV3';

function App() {
  // Verify Firebase initialization (development only)
  if (import.meta.env.DEV) {
    console.warn('Firebase initialized:', app.name);
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <WidgetConfigProvider>
          <BrowserRouter>
            <CommandPalette />
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
                path="/clock"
                element={
                  <ProtectedRoute>
                    <ClockScreen />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Prototypes - protected routes for design exploration */}

              <Route
                path="/prototype/v2"
                element={
                  <ProtectedRoute>
                    <PrototypeV2 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prototype/v3"
                element={
                  <ProtectedRoute>
                    <PrototypeV3 />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found - redirect to settings */}
              <Route path="*" element={<Navigate to="/settings" replace />} />
            </Routes>
          </BrowserRouter>
        </WidgetConfigProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
