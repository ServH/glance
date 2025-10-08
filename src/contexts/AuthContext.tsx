import { createContext, useContext, ReactNode } from 'react';
import type { User, UserCredential } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Context Provider
 * Wraps app to provide authentication state globally
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
