import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

// Mock auth context factory
const mockAuthContext = (user: unknown, loading: boolean): AuthContextType => ({
  user: user as AuthContextType['user'],
  loading,
  error: null,
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn(),
});

describe('ProtectedRoute', () => {
  it('shows loading state when auth is loading', () => {
    const context = mockAuthContext(null, true);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    const context = mockAuthContext(null, false);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    const mockUser = { uid: 'test-123', email: 'test@example.com', displayName: 'Test User' };
    const context = mockAuthContext(mockUser, false);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('does not show loading spinner when user is authenticated', () => {
    const mockUser = { uid: 'test-123', email: 'test@example.com', displayName: 'Test User' };
    const context = mockAuthContext(mockUser, false);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('prioritizes loading state over authentication check', () => {
    // Even with a user present, if loading is true, show loading
    const mockUser = { uid: 'test-123', email: 'test@example.com', displayName: 'Test User' };
    const context = mockAuthContext(mockUser, true);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
