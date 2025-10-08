import { getIdToken } from '@/lib/auth/tokenManager';
import { apiRequest } from '@/lib/api/apiClient';
import { requestCache } from '@/lib/api/requestCache';
import type { GmailMessage, GmailApiMessage, GmailListResponse } from '@/types/gmail';
import { parseEmailAddress, truncateSnippet } from '@/lib/utils/emailParser';

/**
 * Fetch unread emails from Gmail API
 * Returns top 10 most recent unread messages
 * Caches results for 60 seconds
 *
 * @param options.skipCache - Bypass cache and fetch fresh data
 * @returns Array of parsed Gmail messages
 * @throws Error if not authenticated or API request fails
 */
export async function fetchUnreadEmails(
  options: { skipCache?: boolean } = {}
): Promise<GmailMessage[]> {
  const cacheKey = 'gmail:unread';

  // Check cache (unless explicitly skipped)
  if (!options.skipCache) {
    const cached = requestCache.get<GmailMessage[]>(cacheKey);
    if (cached !== null) {
      console.log('📧 Gmail: Using cached emails');
      return cached;
    }
  }

  console.log('📧 Gmail: Fetching fresh emails from API');

  // Get access token
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in again.');
  }

  try {
    // Step 1: List unread message IDs
    const listResponse = await apiRequest<GmailListResponse>(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cacheTtl: 0, // Don't cache this request (we cache final result)
      }
    );

    if (!listResponse.messages || listResponse.messages.length === 0) {
      console.log('📧 Gmail: No unread emails');
      const emptyResult: GmailMessage[] = [];
      requestCache.set(cacheKey, emptyResult, 60);
      return emptyResult;
    }

    // Step 2: Fetch details for each message
    const messages = await Promise.all(
      listResponse.messages.map(msg => fetchMessageDetails(msg.id, token))
    );

    // Filter out any failed fetches (null values)
    const validMessages = messages.filter((msg): msg is GmailMessage => msg !== null);

    // Cache successful result
    requestCache.set(cacheKey, validMessages, 60); // 60 second TTL

    console.log(`📧 Gmail: Fetched ${validMessages.length} unread emails`);

    return validMessages;
  } catch (error: unknown) {
    console.error('📧 Gmail: Fetch failed:', error);

    // If rate limited, throw specific error
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('Gmail API rate limit exceeded. Please try again in a minute.');
    }

    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch emails. Please try again.'
    );
  }
}

/**
 * Fetch detailed metadata for a single message
 * Only requests From, Subject headers + snippet
 *
 * @param messageId Gmail message ID
 * @param token Firebase ID token
 * @returns Parsed Gmail message or null if fetch fails
 */
async function fetchMessageDetails(messageId: string, token: string): Promise<GmailMessage | null> {
  try {
    const msg = await apiRequest<GmailApiMessage>(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cacheTtl: 0, // Individual messages not cached
      }
    );

    // Parse headers
    const headers = msg.payload?.headers || [];
    const fromHeader = headers.find(h => h.name === 'From')?.value || '';
    const subjectHeader = headers.find(h => h.name === 'Subject')?.value || '(No subject)';

    // Parse timestamp
    const timestamp = msg.internalDate ? parseInt(msg.internalDate, 10) : Date.now();

    return {
      id: msg.id,
      threadId: msg.threadId,
      snippet: truncateSnippet(msg.snippet || ''),
      from: parseEmailAddress(fromHeader),
      subject: subjectHeader,
      timestamp,
    };
  } catch (error) {
    console.error(`📧 Gmail: Failed to fetch message ${messageId}:`, error);
    return null; // Skip failed messages
  }
}

/**
 * Manually invalidate email cache
 * Useful after marking email as read or when forcing refresh
 */
export function invalidateEmailCache(): void {
  requestCache.invalidate('gmail:unread');
  console.log('📧 Gmail: Cache invalidated');
}
