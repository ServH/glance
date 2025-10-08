import type { GmailMessage } from '@/types/gmail';
import { formatRelativeTime, truncate } from '@/lib/utils/dateTime';
import { parseSenderName } from '@/lib/utils/emailParser';

interface EmailRowProps {
  email: GmailMessage;
  onClick?: () => void;
}

/**
 * Individual email row component
 * Displays sender, subject, snippet, and relative time
 */
export function EmailRow({ email, onClick }: EmailRowProps) {
  // Extract sender name (use parseSenderName from emailParser)
  const senderName = parseSenderName(email.from);

  return (
    <div
      className="email-row"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="email-row-header">
        <span className="email-sender">{truncate(senderName, 20)}</span>
        <span className="email-time">{formatRelativeTime(email.timestamp)}</span>
      </div>

      <div className="email-subject">{truncate(email.subject, 50)}</div>

      <div className="email-snippet">{truncate(email.snippet, 80)}</div>
    </div>
  );
}
