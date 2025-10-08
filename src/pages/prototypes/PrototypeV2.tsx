import { Clock } from '@/components/Clock';
import { useGmail } from '@/hooks/useGmail';
import { Mail, Calendar } from 'lucide-react';
import '../../styles/clock.css';
import '../../styles/prototype-v2.css';

/**
 * Prototype V2: Clock + Sidebar
 * - Clock takes 60% left side
 * - Sidebar with mini widgets on right 40%
 */
export default function PrototypeV2() {
  const { emails, isLoading } = useGmail({ enabled: true, refetchInterval: 60000 });

  const displayEmails = emails.slice(0, 3);

  return (
    <div className="prototype-v2">
      {/* Left: Giant Clock */}
      <div className="clock-section">
        <Clock size="hero" showDate={true} />
      </div>

      {/* Right: Sidebar with mini widgets */}
      <div className="widgets-sidebar">
        {/* Gmail Mini Widget */}
        <div className="mini-widget">
          <div className="mini-widget-header">
            <Mail className="mini-widget-icon" />
            <span className="mini-widget-title">Gmail</span>
            <span className="mini-widget-count">{emails.length}</span>
          </div>

          <div className="mini-widget-content">
            {isLoading ? (
              <p className="mini-widget-empty">Loading...</p>
            ) : emails.length === 0 ? (
              <p className="mini-widget-empty">All caught up!</p>
            ) : (
              <div className="mini-email-list">
                {displayEmails.map(email => (
                  <div key={email.id} className="mini-email-row">
                    <div className="mini-email-sender">{email.from.split('@')[0]}</div>
                    <div className="mini-email-subject">
                      {email.subject.length > 30
                        ? email.subject.slice(0, 30) + '...'
                        : email.subject}
                    </div>
                  </div>
                ))}
                {emails.length > 3 && (
                  <div className="mini-email-more">+{emails.length - 3} more</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Mini Widget */}
        <div className="mini-widget">
          <div className="mini-widget-header">
            <Calendar className="mini-widget-icon" />
            <span className="mini-widget-title">Calendar</span>
            <span className="mini-widget-count">3</span>
          </div>

          <div className="mini-widget-content">
            <p className="mini-widget-empty">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
