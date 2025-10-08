import { useState, useEffect } from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export interface TimeOfDayColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  orb1: string;
  orb2: string;
}

const COLOR_THEMES: Record<TimeOfDay, TimeOfDayColors> = {
  dawn: {
    // 5am - 9am: Sunrise colors
    primary: '#FF6B6B',
    secondary: '#FFD93D',
    accent: '#FF8E53',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #FF8E53 100%)',
    orb1: 'rgba(255, 107, 107, 0.3)',
    orb2: 'rgba(255, 217, 61, 0.3)',
  },
  day: {
    // 9am - 5pm: Bright day colors
    primary: '#4ECDC4',
    secondary: '#44A8F0',
    accent: '#95E1D3',
    gradient: 'linear-gradient(135deg, #667eea 0%, #4ECDC4 50%, #44A8F0 100%)',
    orb1: 'rgba(78, 205, 196, 0.3)',
    orb2: 'rgba(68, 168, 240, 0.3)',
  },
  dusk: {
    // 5pm - 8pm: Sunset colors
    primary: '#F38181',
    secondary: '#AA96DA',
    accent: '#FCBAD3',
    gradient: 'linear-gradient(135deg, #F38181 0%, #AA96DA 50%, #FCBAD3 100%)',
    orb1: 'rgba(243, 129, 129, 0.3)',
    orb2: 'rgba(170, 150, 218, 0.3)',
  },
  night: {
    // 8pm - 5am: Deep night colors
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#6366F1',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
    orb1: 'rgba(139, 92, 246, 0.3)',
    orb2: 'rgba(236, 72, 153, 0.3)',
  },
};

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => {
    const hour = new Date().getHours();
    return getTimeOfDay(hour);
  });

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      const newTimeOfDay = getTimeOfDay(hour);
      setTimeOfDay(newTimeOfDay);
    };

    // Check every minute
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    timeOfDay,
    colors: COLOR_THEMES[timeOfDay],
  };
}
