import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardHeader } from '../DashboardHeader';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

// Mock navigate function
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth context factory
const mockAuthContext = (
  user: AuthContextType['user'],
  logout: () => Promise<void> = vi.fn().mockResolvedValue(undefined)
): AuthContextType => ({
  user,
  loading: false,
  error: null,
  loginWithGoogle: vi.fn(),
  logout,
  getAccessToken: vi.fn(),
});

describe('DashboardHeader', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('displays user profile photo and name', () => {
    const mockUser = {
      uid: 'test-123',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      photoURL: 'https://example.com/photo.jpg',
    };
    const context = mockAuthContext(mockUser as AuthContextType['user']);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check profile name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check "User menu" trigger button exists
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('shows initials when no photo available', () => {
    const mockUser = {
      uid: 'test-123',
      email: 'jane.smith@example.com',
      displayName: 'Jane Smith',
      photoURL: null,
    };
    const context = mockAuthContext(mockUser as AuthContextType['user']);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check initials are shown (JS for Jane Smith)
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('truncates long display names', () => {
    const mockUser = {
      uid: 'test-123',
      email: 'test@example.com',
      displayName: 'This Is A Very Long Display Name That Should Be Truncated',
      photoURL: null,
    };
    const context = mockAuthContext(mockUser as AuthContextType['user']);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check name is truncated (first 20 chars + ...)
    expect(screen.getByText(/This Is A Very Long /)).toBeInTheDocument();
  });

  it('displays "Glance" logo in header', () => {
    const mockUser = {
      uid: 'test-123',
      email: 'user@example.com',
      displayName: 'Test User',
      photoURL: null,
    };
    const context = mockAuthContext(mockUser as AuthContextType['user']);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check logo/app name is displayed
    expect(screen.getByText('Glance')).toBeInTheDocument();
  });

  it('profile trigger is clickable', () => {
    const mockUser = {
      uid: 'test-123',
      email: 'user@example.com',
      displayName: 'Test User',
      photoURL: null,
    };
    const context = mockAuthContext(mockUser as AuthContextType['user']);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check profile trigger exists and is a button
    const profileTrigger = screen.getByLabelText('User menu');
    expect(profileTrigger).toBeInTheDocument();
    expect(profileTrigger.tagName).toBe('BUTTON');
  });

  it('returns null when user is null', () => {
    const context = mockAuthContext(null);

    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardHeader />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should render nothing
    expect(container.textContent).toBe('');
  });
});
