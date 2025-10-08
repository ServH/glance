import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Public Route Wrapper
 * Redirects authenticated users to dashboard
 * Used for login page (no need to show if already logged in)
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Don't show loading spinner on public routes
  // Just wait silently
  if (loading) {
    return null;
  }

  // Redirect to dashboard if already authenticated
  // Check if there's a saved location to redirect to
  if (user) {
    const from =
      (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // User is not authenticated - render public content (login page)
  return <>{children}</>;
}
