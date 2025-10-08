import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from '@/components/Clock';
import { NotificationBadge } from '@/components/widgets/NotificationBadge';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useGmail } from '@/hooks/useGmail';
import { useWidgetConfig } from '@/contexts/WidgetConfigContext';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { Mail, Calendar, X, Settings } from 'lucide-react';
import { GmailWidget } from '@/components/widgets/GmailWidget';
import '../styles/clock-enhanced.css';
import '../styles/clock-screen.css';

/**
 * Clock Screen - Main display view
 * Giant clock with configurable widget notification badges
 * Slide-in panel shows widget details on click
 * Dynamic colors based on time of day
 */
export default function ClockScreen() {
  const navigate = useNavigate();
  const { config } = useWidgetConfig();
  const { colors } = useTimeOfDay();
  const { emails } = useGmail({
    enabled: config.gmail.enabled,
    refetchInterval: (config.gmail.pollingInterval || 60) * 1000,
  });
  const [activePanel, setActivePanel] = useState<'gmail' | 'calendar' | null>(null);

  const unreadCount = emails.length;

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  // Apply dynamic CSS variables for colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--gradient-bg', colors.gradient);
    root.style.setProperty('--orb-1-color', colors.orb1);
    root.style.setProperty('--orb-2-color', colors.orb2);
  }, [colors]);

  return (
    <motion.div
      className="clock-screen-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ background: colors.gradient }}
    >
      {/* Particle background */}
      <ParticleBackground />

      {/* Settings button */}
      <motion.button
        className="clock-settings-btn"
        onClick={handleGoToSettings}
        aria-label="Go to Settings"
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Settings size={24} />
      </motion.button>

      {/* Main screen: Giant clock */}
      <div className="clock-display-area">
        <Clock size="hero" showDate={true} />

        {/* Mini badges at bottom - only show enabled widgets */}
        <motion.div
          className="notification-badges"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence>
            {config.gmail.enabled && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <NotificationBadge
                  icon={Mail}
                  count={unreadCount}
                  label="Gmail"
                  onClick={() => setActivePanel('gmail')}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {config.calendar.enabled && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
              >
                <NotificationBadge
                  icon={Calendar}
                  count={3}
                  label="Events"
                  onClick={() => setActivePanel('calendar')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Slide-in panel */}
      <AnimatePresence>
        {activePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              className="panel-backdrop"
              onClick={() => setActivePanel(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Panel */}
            <motion.div
              className="slide-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="slide-panel-header">
                <h2 className="slide-panel-title">
                  {activePanel === 'gmail' ? 'Gmail' : 'Calendar'}
                </h2>
                <motion.button
                  className="slide-panel-close"
                  onClick={() => setActivePanel(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="slide-panel-content">
                {activePanel === 'gmail' && <GmailWidget />}
                {activePanel === 'calendar' && (
                  <div className="panel-placeholder">Calendar widget coming soon...</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
