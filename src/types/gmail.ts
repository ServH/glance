/**
 * Gmail API type definitions
 * Based on: https://developers.google.com/gmail/api/reference/rest/v1/users.messages
 */

/**
 * Parsed Gmail message for display in UI
 */
export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from: string; // Email address only
  subject: string;
  timestamp: number; // Unix timestamp in milliseconds
}

/**
 * Raw Gmail API message response (metadata format)
 * Only includes fields we request via API
 */
export interface GmailApiMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: Array<{
      name: string;
      value: string;
    }>;
  };
  internalDate?: string; // String representation of Unix timestamp
}

/**
 * Gmail API list messages response
 */
export interface GmailListResponse {
  messages?: Array<{
    id: string;
    threadId: string;
  }>;
  nextPageToken?: string;
  resultSizeEstimate?: number;
}
