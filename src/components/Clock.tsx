import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ClockProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  showDate?: boolean;
}

/**
 * Digital clock component with real-time updates
 * 3D depth effect and premium animations
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
    <motion.div
      className="clock-display"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        className={`clock-time ${sizeClasses[size]}`}
        style={{
          transform: 'translateZ(30px)',
        }}
      >
        {timeString}
      </motion.div>
      {showDate && (
        <motion.div
          className={`clock-date ${dateSizeClasses[size]}`}
          style={{
            transform: 'translateZ(15px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {dateString}
        </motion.div>
      )}
    </motion.div>
  );
}
