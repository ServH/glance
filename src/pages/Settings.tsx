import { useNavigate } from 'react-router-dom';
import { useWidgetConfig } from '@/contexts/WidgetConfigContext';
import { Mail, Calendar, ArrowRight, Power } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import '../styles/settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const { config, updateWidgetConfig, resetConfig } = useWidgetConfig();
  const { logout } = useAuthContext();

  const handleGmailToggle = () => {
    updateWidgetConfig('gmail', { enabled: !config.gmail.enabled });
  };

  const handleCalendarToggle = () => {
    updateWidgetConfig('calendar', { enabled: !config.calendar.enabled });
  };

  const handleGoToClockScreen = () => {
    navigate('/clock');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="settings-container">
      {/* Animated blur orbs (matching login aesthetics) */}
      <div className="settings-orb settings-orb-1" />
      <div className="settings-orb settings-orb-2" />

      <div className="settings-content">
        {/* Header */}
        <header className="settings-header">
          <div>
            <h1 className="settings-title">Configure Your Widgets</h1>
            <p className="settings-subtitle">
              Enable or disable widgets to personalize your clock screen
            </p>
          </div>

          <button onClick={handleLogout} className="settings-logout-btn" aria-label="Logout">
            <Power size={20} />
          </button>
        </header>

        {/* Widget Cards */}
        <div className="settings-widgets">
          {/* Gmail Widget */}
          <div className="widget-card">
            <div className="widget-card-header">
              <div className="widget-card-icon-wrapper">
                <Mail className="widget-card-icon" size={28} />
              </div>
              <div className="widget-card-info">
                <h3 className="widget-card-title">Gmail</h3>
                <p className="widget-card-description">
                  Display unread email notifications from your Gmail account
                </p>
              </div>
            </div>

            <div className="widget-card-actions">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.gmail.enabled}
                  onChange={handleGmailToggle}
                  aria-label="Toggle Gmail widget"
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="widget-card">
            <div className="widget-card-header">
              <div className="widget-card-icon-wrapper">
                <Calendar className="widget-card-icon" size={28} />
              </div>
              <div className="widget-card-info">
                <h3 className="widget-card-title">Calendar</h3>
                <p className="widget-card-description">
                  View upcoming events and meetings from Google Calendar
                </p>
                <span className="widget-card-badge">Coming Soon</span>
              </div>
            </div>

            <div className="widget-card-actions">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.calendar.enabled}
                  onChange={handleCalendarToggle}
                  disabled
                  aria-label="Toggle Calendar widget"
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-actions">
          <button onClick={resetConfig} className="settings-btn settings-btn-secondary">
            Reset to Defaults
          </button>

          <button onClick={handleGoToClockScreen} className="settings-btn settings-btn-primary">
            Go to Clock Screen
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
