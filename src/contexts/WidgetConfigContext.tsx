import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Widget configuration types
export interface WidgetConfig {
  gmail: {
    enabled: boolean;
    pollingInterval?: number; // in seconds
  };
  calendar: {
    enabled: boolean;
  };
  // Future widgets can be added here
}

// Default configuration
const DEFAULT_CONFIG: WidgetConfig = {
  gmail: {
    enabled: true,
    pollingInterval: 60,
  },
  calendar: {
    enabled: false,
  },
};

interface WidgetConfigContextType {
  config: WidgetConfig;
  updateWidgetConfig: <K extends keyof WidgetConfig>(
    widgetId: K,
    updates: Partial<WidgetConfig[K]>
  ) => void;
  resetConfig: () => void;
}

const WidgetConfigContext = createContext<WidgetConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'glance_widget_config';

interface WidgetConfigProviderProps {
  children: ReactNode;
}

export function WidgetConfigProvider({ children }: WidgetConfigProviderProps) {
  // Load config from localStorage on mount
  const [config, setConfig] = useState<WidgetConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load widget config from localStorage:', error);
    }
    return DEFAULT_CONFIG;
  });

  // Persist config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save widget config to localStorage:', error);
    }
  }, [config]);

  // Update specific widget configuration
  const updateWidgetConfig = <K extends keyof WidgetConfig>(
    widgetId: K,
    updates: Partial<WidgetConfig[K]>
  ) => {
    setConfig(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        ...updates,
      },
    }));
  };

  // Reset to default configuration
  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <WidgetConfigContext.Provider value={{ config, updateWidgetConfig, resetConfig }}>
      {children}
    </WidgetConfigContext.Provider>
  );
}

export function useWidgetConfig() {
  const context = useContext(WidgetConfigContext);
  if (context === undefined) {
    throw new Error('useWidgetConfig must be used within a WidgetConfigProvider');
  }
  return context;
}
