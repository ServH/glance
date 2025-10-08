import { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { handleAuthError } from '@/lib/auth/errors';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

/**
 * Authentication hook
 * Manages user auth state, login, logout, and token access
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('🔐 Setting up auth state listener');

    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        console.log('Auth state changed:', user ? user.email : 'No user');
        setUser(user);
        setLoading(false);
      },
      error => {
        console.error('Auth state change error:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => {
      console.log('🔓 Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  /**
   * Sign in with Google using popup flow
   * Requests Gmail and Calendar readonly scopes
   */
  const loginWithGoogle = async (): Promise<UserCredential> => {
    console.log('🚀 Initiating Google OAuth flow');

    const provider = new GoogleAuthProvider();

    // Request Gmail and Calendar readonly scopes for Epic 2 & 5
    // Note: App in "Testing" mode - users will see "unverified app" warning until OAuth verification complete
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/calendar.readonly');

    // Custom OAuth parameters
    provider.setCustomParameters({
      prompt: 'select_account', // Always show account picker
    });

    try {
      // Trigger OAuth popup
      const result = await signInWithPopup(auth, provider);

      // Extract credential and access token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      // Store Google OAuth access token for API calls
      if (accessToken) {
        setGoogleAccessToken(accessToken);
        // Also store in sessionStorage for persistence across page reloads
        sessionStorage.setItem('google_access_token', accessToken);
      }

      console.log('✅ Login successful:', {
        email: result.user.email,
        uid: result.user.uid,
        displayName: result.user.displayName,
        hasAccessToken: !!accessToken,
      });

      // Clear any previous errors
      setError(null);

      return result;
    } catch (error) {
      console.error('❌ Login error:', error);

      // Handle and transform error
      const authError = handleAuthError(error as { code?: string; message?: string });
      setError(authError);

      throw authError;
    }
  };

  /**
   * Sign out current user
   * Clears Firebase auth state and redirects to login
   */
  const logout = async (): Promise<void> => {
    console.log('👋 Logging out user');

    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
      setGoogleAccessToken(null);
      // Clear stored token
      sessionStorage.removeItem('google_access_token');

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  /**
   * Get Google OAuth access token for API authentication
   * This is the token needed for Gmail API, not Firebase ID token
   */
  const getAccessToken = async (): Promise<string | null> => {
    if (!user) {
      console.warn('Cannot get access token: No user authenticated');
      return null;
    }

    // Try to get from state first
    if (googleAccessToken) {
      console.log('🔑 Access token retrieved from state');
      return googleAccessToken;
    }

    // Fall back to sessionStorage
    const storedToken = sessionStorage.getItem('google_access_token');
    if (storedToken) {
      console.log('🔑 Access token retrieved from sessionStorage');
      setGoogleAccessToken(storedToken);
      return storedToken;
    }

    console.warn('⚠️ No Google access token available. User may need to re-authenticate.');
    return null;
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    getAccessToken,
  };
}
