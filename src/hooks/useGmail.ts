import { useState, useEffect, useCallback } from 'react';
import { fetchUnreadEmails } from '@/lib/api/gmail';
import type { GmailMessage } from '@/types/gmail';

export interface UseGmailOptions {
  enabled?: boolean; // Enable/disable fetching
  refetchInterval?: number; // Polling interval (ms)
}

export interface UseGmailReturn {
  emails: GmailMessage[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Gmail unread emails
 * Supports polling and manual refresh
 *
 * @param options Configuration options
 * @returns Gmail state and refetch function
 *
 * @example
 * ```tsx
 * const { emails, isLoading, error, refetch } = useGmail({
 *   enabled: true,
 *   refetchInterval: 60000, // Poll every 60 seconds
 * });
 * ```
 */
export function useGmail(options: UseGmailOptions = {}): UseGmailReturn {
  const { enabled = true, refetchInterval = 60000 } = options;

  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(
    async (skipCache: boolean = false) => {
      if (!enabled) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchUnreadEmails({ skipCache });
        setEmails(data);
      } catch (err: unknown) {
        console.error('useGmail: Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch emails');
      } finally {
        setIsLoading(false);
      }
    },
    [enabled]
  );

  // Initial fetch
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Polling
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    const interval = setInterval(() => {
      // Only poll if tab is visible
      if (!document.hidden) {
        fetchEmails();
      }
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [enabled, refetchInterval, fetchEmails]);

  // Manual refetch (bypasses cache)
  const refetch = useCallback(async () => {
    await fetchEmails(/* skipCache */ true);
  }, [fetchEmails]);

  return {
    emails,
    isLoading,
    error,
    refetch,
  };
}
