import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from '@/components/Clock';
import { NotificationBadge } from '@/components/widgets/NotificationBadge';
import { useGmail } from '@/hooks/useGmail';
import { useWidgetConfig } from '@/contexts/WidgetConfigContext';
import { Mail, Calendar, X, Settings } from 'lucide-react';
import { GmailWidget } from '@/components/widgets/GmailWidget';
import '../styles/clock-enhanced.css';
import '../styles/clock-screen.css';

/**
 * Clock Screen - Main display view
 * Giant clock with configurable widget notification badges
 * Slide-in panel shows widget details on click
 */
export default function ClockScreen() {
  const navigate = useNavigate();
  const { config } = useWidgetConfig();
  const { emails } = useGmail({
    enabled: config.gmail.enabled,
    refetchInterval: (config.gmail.pollingInterval || 60) * 1000,
  });
  const [activePanel, setActivePanel] = useState<'gmail' | 'calendar' | null>(null);

  const unreadCount = emails.length;

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="clock-screen-container">
      {/* Settings button */}
      <button
        className="clock-settings-btn"
        onClick={handleGoToSettings}
        aria-label="Go to Settings"
      >
        <Settings size={24} />
      </button>

      {/* Main screen: Giant clock */}
      <div className="clock-display-area">
        <Clock size="hero" showDate={true} />

        {/* Mini badges at bottom - only show enabled widgets */}
        <div className="notification-badges">
          {config.gmail.enabled && (
            <NotificationBadge
              icon={Mail}
              count={unreadCount}
              label="Gmail"
              onClick={() => setActivePanel('gmail')}
            />
          )}
          {config.calendar.enabled && (
            <NotificationBadge
              icon={Calendar}
              count={3}
              label="Events"
              onClick={() => setActivePanel('calendar')}
            />
          )}
        </div>
      </div>

      {/* Slide-in panel */}
      {activePanel && (
        <>
          {/* Backdrop */}
          <div className="panel-backdrop" onClick={() => setActivePanel(null)} />

          {/* Panel */}
          <div className="slide-panel">
            <div className="slide-panel-header">
              <h2 className="slide-panel-title">
                {activePanel === 'gmail' ? 'Gmail' : 'Calendar'}
              </h2>
              <button className="slide-panel-close" onClick={() => setActivePanel(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="slide-panel-content">
              {activePanel === 'gmail' && <GmailWidget />}
              {activePanel === 'calendar' && (
                <div className="panel-placeholder">Calendar widget coming soon...</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
