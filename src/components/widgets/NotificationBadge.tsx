import type { LucideIcon } from 'lucide-react';

interface NotificationBadgeProps {
  icon: LucideIcon;
  count: number;
  label: string;
  onClick?: () => void;
}

/**
 * Minimal notification badge for clock screen
 */
export function NotificationBadge({ icon: Icon, count, label, onClick }: NotificationBadgeProps) {
  return (
    <button className="notification-badge" onClick={onClick}>
      <Icon className="notification-badge-icon" />
      <div className="notification-badge-content">
        <span className="notification-badge-count">{count}</span>
        <span className="notification-badge-label">{label}</span>
      </div>
    </button>
  );
}
