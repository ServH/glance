import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationBadgeProps {
  icon: LucideIcon;
  count: number;
  label: string;
  onClick?: () => void;
}

/**
 * Minimal notification badge for clock screen
 * Premium micro-interactions with Framer Motion
 */
export function NotificationBadge({ icon: Icon, count, label, onClick }: NotificationBadgeProps) {
  return (
    <motion.button
      className="notification-badge"
      onClick={onClick}
      whileHover={{
        scale: 1.1,
        y: -5,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="notification-badge-icon" />
      </motion.div>
      <div className="notification-badge-content">
        <motion.span
          className="notification-badge-count"
          key={count}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {count}
        </motion.span>
        <span className="notification-badge-label">{label}</span>
      </div>
    </motion.button>
  );
}
