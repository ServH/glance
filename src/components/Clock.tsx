import { useState, useEffect } from 'react';

interface ClockProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  showDate?: boolean;
}

/**
 * Digital clock component with real-time updates
 */
export function Clock({ size = 'large', showDate = true }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-5xl',
    large: 'text-8xl',
    hero: 'text-[12rem]',
  };

  const dateSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    hero: 'text-4xl',
  };

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="clock-display">
      <div className={`clock-time ${sizeClasses[size]}`}>{timeString}</div>
      {showDate && <div className={`clock-date ${dateSizeClasses[size]}`}>{dateString}</div>}
    </div>
  );
}
