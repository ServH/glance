import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicRoute } from '../PublicRoute';
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

describe('PublicRoute', () => {
  it('shows nothing while auth is loading', () => {
    const context = mockAuthContext(null, true);

    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div>Public Content</div>
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should render null (no content)
    expect(container.textContent).toBe('');
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('redirects to /dashboard when user is authenticated', () => {
    const mockUser = { uid: 'test-123', email: 'test@example.com', displayName: 'Test User' };
    const context = mockAuthContext(mockUser, false);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div>Public Content</div>
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should redirect to dashboard
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('renders children when user is not authenticated', () => {
    const context = mockAuthContext(null, false);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div>Public Content</div>
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('does not show loading spinner on public routes', () => {
    const context = mockAuthContext(null, true);

    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div>Public Content</div>
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should not show "Loading..." text
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    // Should render nothing
    expect(container.textContent).toBe('');
  });

  it('prioritizes loading state - renders null even with no user', () => {
    const context = mockAuthContext(null, true);

    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={context}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div>Public Content</div>
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should render null during loading
    expect(container.textContent).toBe('');
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });
});
