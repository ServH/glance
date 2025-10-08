import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUnreadEmails, invalidateEmailCache } from '../gmail';
import { requestCache } from '../requestCache';
import * as tokenManager from '@/lib/auth/tokenManager';
import * as apiClient from '@/lib/api/apiClient';

// Mock dependencies
vi.mock('@/lib/auth/tokenManager');
vi.mock('@/lib/api/apiClient');

describe('Gmail API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requestCache.clear();

    // Default mock: user is authenticated
    vi.mocked(tokenManager.getIdToken).mockResolvedValue('mock-token-12345');
  });

  afterEach(() => {
    requestCache.clear();
  });

  describe('fetchUnreadEmails', () => {
    it('fetches and parses unread emails', async () => {
      // Mock list response
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        messages: [
          { id: 'msg-1', threadId: 'thread-1' },
          { id: 'msg-2', threadId: 'thread-2' },
        ],
      });

      // Mock message details
      vi.mocked(apiClient.apiRequest)
        .mockResolvedValueOnce({
          id: 'msg-1',
          threadId: 'thread-1',
          snippet: 'Test email 1',
          internalDate: '1609459200000',
          payload: {
            headers: [
              { name: 'From', value: 'sender@example.com' },
              { name: 'Subject', value: 'Test Subject 1' },
            ],
          },
        })
        .mockResolvedValueOnce({
          id: 'msg-2',
          threadId: 'thread-2',
          snippet: 'Test email 2',
          internalDate: '1609545600000',
          payload: {
            headers: [
              { name: 'From', value: 'John Doe <john@example.com>' },
              { name: 'Subject', value: 'Test Subject 2' },
            ],
          },
        });

      const emails = await fetchUnreadEmails();

      expect(emails).toHaveLength(2);
      expect(emails[0]).toMatchObject({
        id: 'msg-1',
        from: 'sender@example.com',
        subject: 'Test Subject 1',
      });
      expect(emails[1]).toMatchObject({
        id: 'msg-2',
        from: 'john@example.com', // Extracted from angle brackets
        subject: 'Test Subject 2',
      });
    });

    it('returns empty array when no unread emails', async () => {
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({ messages: [] });

      const emails = await fetchUnreadEmails();

      expect(emails).toEqual([]);
    });

    it('throws error when not authenticated', async () => {
      vi.mocked(tokenManager.getIdToken).mockResolvedValue(null);

      await expect(fetchUnreadEmails()).rejects.toThrow('Not authenticated. Please log in again.');
    });

    it('caches results for subsequent calls', async () => {
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        messages: [{ id: 'msg-1', threadId: 'thread-1' }],
      });

      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        id: 'msg-1',
        threadId: 'thread-1',
        snippet: 'Cached email',
        internalDate: '1609459200000',
        payload: {
          headers: [
            { name: 'From', value: 'test@example.com' },
            { name: 'Subject', value: 'Cached' },
          ],
        },
      });

      // First fetch - hits API
      const emails1 = await fetchUnreadEmails();
      expect(vi.mocked(apiClient.apiRequest)).toHaveBeenCalledTimes(2);

      // Second fetch - uses cache
      const emails2 = await fetchUnreadEmails();
      expect(vi.mocked(apiClient.apiRequest)).toHaveBeenCalledTimes(2); // No new calls
      expect(emails2).toEqual(emails1);
    });

    it('bypasses cache when skipCache is true', async () => {
      vi.mocked(apiClient.apiRequest)
        .mockResolvedValueOnce({ messages: [] })
        .mockResolvedValueOnce({ messages: [] });

      await fetchUnreadEmails();
      const callCount1 = vi.mocked(apiClient.apiRequest).mock.calls.length;

      await fetchUnreadEmails({ skipCache: true });
      const callCount2 = vi.mocked(apiClient.apiRequest).mock.calls.length;

      expect(callCount2).toBeGreaterThan(callCount1);
    });

    it('handles missing subject header', async () => {
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        messages: [{ id: 'msg-1', threadId: 'thread-1' }],
      });

      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        id: 'msg-1',
        threadId: 'thread-1',
        snippet: 'No subject email',
        internalDate: '1609459200000',
        payload: {
          headers: [{ name: 'From', value: 'sender@example.com' }],
          // No Subject header
        },
      });

      const emails = await fetchUnreadEmails();

      expect(emails[0].subject).toBe('(No subject)');
    });

    it('filters out failed message fetches', async () => {
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        messages: [
          { id: 'msg-1', threadId: 'thread-1' },
          { id: 'msg-2', threadId: 'thread-2' },
        ],
      });

      // First message succeeds
      vi.mocked(apiClient.apiRequest).mockResolvedValueOnce({
        id: 'msg-1',
        threadId: 'thread-1',
        snippet: 'Success',
        internalDate: '1609459200000',
        payload: {
          headers: [
            { name: 'From', value: 'sender@example.com' },
            { name: 'Subject', value: 'Success' },
          ],
        },
      });

      // Second message fails
      vi.mocked(apiClient.apiRequest).mockRejectedValueOnce(new Error('Failed to fetch'));

      const emails = await fetchUnreadEmails();

      // Should return only the successful message
      expect(emails).toHaveLength(1);
      expect(emails[0].id).toBe('msg-1');
    });

    it('throws specific error for rate limiting', async () => {
      vi.mocked(apiClient.apiRequest).mockRejectedValueOnce(new Error('429 Too Many Requests'));

      await expect(fetchUnreadEmails()).rejects.toThrow('Gmail API rate limit exceeded');
    });
  });

  describe('invalidateEmailCache', () => {
    it('clears cached emails', async () => {
      vi.mocked(apiClient.apiRequest)
        .mockResolvedValueOnce({ messages: [] })
        .mockResolvedValueOnce({ messages: [] });

      await fetchUnreadEmails();
      const callCount1 = vi.mocked(apiClient.apiRequest).mock.calls.length;

      // Invalidate cache
      invalidateEmailCache();

      // Should re-fetch after cache invalidation
      await fetchUnreadEmails();
      const callCount2 = vi.mocked(apiClient.apiRequest).mock.calls.length;

      expect(callCount2).toBeGreaterThan(callCount1);
    });
  });
});
