import { useGmail } from '@/hooks/useGmail';
import { EmailRow } from './EmailRow';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { WidgetSkeleton } from './WidgetSkeleton';
import { Inbox, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../../styles/gmail-widget.css';

/**
 * Gmail Widget - displays unread emails
 * Shows loading, empty, error, and success states
 * Supports manual refresh and polling
 */
export function GmailWidget() {
  const { emails, isLoading, error, refetch } = useGmail({
    enabled: true,
    refetchInterval: 60000, // 60 seconds
  });

  const handleRefresh = () => {
    refetch(); // Bypasses cache
  };

  // Loading state (only show skeleton on initial load)
  if (isLoading && emails.length === 0) {
    return (
      <div className="gmail-widget">
        <div className="widget-header">
          <h2 className="widget-title">Gmail</h2>
        </div>
        <WidgetSkeleton rows={5} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="gmail-widget">
        <div className="widget-header">
          <h2 className="widget-title">Gmail</h2>
        </div>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  // Empty state
  if (emails.length === 0) {
    return (
      <div className="gmail-widget">
        <div className="widget-header">
          <h2 className="widget-title">Gmail</h2>
          <Button variant="ghost" size="icon" onClick={handleRefresh} aria-label="Refresh emails">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <EmptyState icon={Inbox} title="All caught up!" description="No unread emails" />
      </div>
    );
  }

  // Success state - display emails
  const displayEmails = emails.slice(0, 5);
  const moreCount = emails.length - 5;

  return (
    <div className="gmail-widget">
      {/* Header with count */}
      <div className="widget-header">
        <h2 className="widget-title">Gmail ({emails.length})</h2>
        <Button variant="ghost" size="icon" onClick={handleRefresh} aria-label="Refresh emails">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Email list */}
      <div className="email-list">
        {displayEmails.map(email => (
          <EmailRow key={email.id} email={email} />
        ))}
      </div>

      {/* View all link */}
      {moreCount > 0 && (
        <a
          href="https://mail.google.com/mail/u/0/#inbox"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-link"
        >
          View all ({moreCount} more)
        </a>
      )}
    </div>
  );
}
