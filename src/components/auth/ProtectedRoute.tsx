import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { RouteLoading } from './RouteLoading';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected Route Wrapper
 * Redirects unauthenticated users to /login
 * Shows loading state while auth is being determined
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return <RouteLoading />;
  }

  // Redirect to login if not authenticated
  // Save the attempted location for post-login redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated - render protected content
  return <>{children}</>;
}
