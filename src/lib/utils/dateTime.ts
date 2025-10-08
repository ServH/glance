/**
 * Date and time formatting utilities
 */

/**
 * Format timestamp as relative time
 * Examples: "Just now", "2m ago", "1h ago", "Yesterday", "Jan 15"
 *
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Less than 1 minute
  if (seconds < 60) {
    return 'Just now';
  }

  // Less than 1 hour
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (hours < 24) {
    return `${hours}h ago`;
  }

  // Yesterday
  if (days === 1) {
    return 'Yesterday';
  }

  // Less than 7 days
  if (days < 7) {
    return `${days}d ago`;
  }

  // Same year - show month and day
  const date = new Date(timestamp);
  const thisYear = new Date().getFullYear();
  if (date.getFullYear() === thisYear) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // Different year - include year
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncate text with ellipsis
 *
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
