/**
 * Firebase Auth error codes
 * https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export enum AuthErrorCode {
  POPUP_CLOSED = 'auth/popup-closed-by-user',
  POPUP_BLOCKED = 'auth/popup-blocked',
  UNAUTHORIZED_DOMAIN = 'auth/unauthorized-domain',
  NETWORK_ERROR = 'auth/network-request-failed',
  USER_DISABLED = 'auth/user-disabled',
  INVALID_CREDENTIAL = 'auth/invalid-credential',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
}

/**
 * Transform Firebase auth errors into user-friendly messages
 */
export function handleAuthError(error: { code?: string; message?: string }): Error {
  const code = error.code;

  switch (code) {
    case AuthErrorCode.POPUP_CLOSED:
      return new Error('Sign-in was cancelled. Please try again.');

    case AuthErrorCode.POPUP_BLOCKED:
      return new Error(
        'Popup was blocked by your browser. Please allow popups for this site and try again.'
      );

    case AuthErrorCode.UNAUTHORIZED_DOMAIN:
      return new Error('This domain is not authorized for sign-in. Please contact support.');

    case AuthErrorCode.NETWORK_ERROR:
      return new Error('Network error. Please check your internet connection and try again.');

    case AuthErrorCode.USER_DISABLED:
      return new Error('Your account has been disabled. Please contact support.');

    case AuthErrorCode.INVALID_CREDENTIAL:
      return new Error('Invalid credentials. Please try signing in again.');

    case AuthErrorCode.OPERATION_NOT_ALLOWED:
      return new Error('Google sign-in is not enabled. Please contact support.');

    case AuthErrorCode.TOO_MANY_REQUESTS:
      return new Error('Too many failed attempts. Please wait a few minutes and try again.');

    default:
      // Generic error for unknown cases
      return new Error(error.message || 'An unexpected error occurred. Please try again later.');
  }
}
