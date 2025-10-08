/**
 * Get Google OAuth access token for Gmail API
 * Note: This retrieves from sessionStorage where it's stored during login
 * @returns Google OAuth access token or null if not authenticated
 * @throws Error if token retrieval fails
 */
export async function getIdToken(): Promise<string | null> {
  // Get Google OAuth access token from sessionStorage
  const token = sessionStorage.getItem('google_access_token');

  if (!token) {
    console.warn('getIdToken: No Google access token available. User needs to login.');
    return null;
  }

  return token;
}
