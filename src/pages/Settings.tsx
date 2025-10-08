import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWidgetConfig } from '@/contexts/WidgetConfigContext';
import { Mail, Calendar, ArrowRight, Power } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useEffect } from 'react';
import '../styles/settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const { config, updateWidgetConfig, resetConfig } = useWidgetConfig();
  const { logout } = useAuthContext();
  const { colors } = useTimeOfDay();

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

  // Apply dynamic CSS variables for colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--orb-1-color', colors.orb1);
    root.style.setProperty('--orb-2-color', colors.orb2);
  }, [colors]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="settings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: colors.gradient }}
    >
      {/* Animated blur orbs (matching login aesthetics) */}
      <div className="settings-orb settings-orb-1" />
      <div className="settings-orb settings-orb-2" />

      <motion.div
        className="settings-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className="settings-header" variants={itemVariants}>
          <div>
            <h1 className="settings-title">Configure Your Widgets</h1>
            <p className="settings-subtitle">
              Enable or disable widgets to personalize your clock screen
            </p>
          </div>

          <motion.button
            onClick={handleLogout}
            className="settings-logout-btn"
            aria-label="Logout"
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Power size={20} />
          </motion.button>
        </motion.header>

        {/* Widget Cards */}
        <div className="settings-widgets">
          {/* Gmail Widget */}
          <motion.div className="widget-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="widget-card-header">
              <motion.div
                className="widget-card-icon-wrapper"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Mail className="widget-card-icon" size={28} />
              </motion.div>
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
          </motion.div>

          {/* Calendar Widget */}
          <motion.div className="widget-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="widget-card-header">
              <motion.div
                className="widget-card-icon-wrapper"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Calendar className="widget-card-icon" size={28} />
              </motion.div>
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
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div className="settings-actions" variants={itemVariants}>
          <motion.button
            onClick={resetConfig}
            className="settings-btn settings-btn-secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Reset to Defaults
          </motion.button>

          <motion.button
            onClick={handleGoToClockScreen}
            className="settings-btn settings-btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Go to Clock Screen
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
