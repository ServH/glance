import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Clock, Mail, Calendar, LogOut, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWidgetConfig } from '@/contexts/WidgetConfigContext';
import '../styles/command-palette.css';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { config, updateWidgetConfig } = useWidgetConfig();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCommand = (command: () => void) => {
    command();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="command-palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            className="command-palette-container"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Command className="command-palette">
              <div className="command-palette-header">
                <Command.Input
                  placeholder="Type a command or search..."
                  className="command-palette-input"
                />
                <button
                  className="command-palette-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <Command.List className="command-palette-list">
                <Command.Empty className="command-palette-empty">No results found.</Command.Empty>

                <Command.Group heading="Navigation" className="command-palette-group">
                  <Command.Item
                    onSelect={() => handleCommand(() => navigate('/clock'))}
                    className="command-palette-item"
                  >
                    <Clock size={18} />
                    <span>Clock Screen</span>
                    <span className="command-palette-shortcut">⌘C</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleCommand(() => navigate('/settings'))}
                    className="command-palette-item"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                    <span className="command-palette-shortcut">⌘S</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Widgets" className="command-palette-group">
                  <Command.Item
                    onSelect={() =>
                      handleCommand(() =>
                        updateWidgetConfig('gmail', { enabled: !config.gmail.enabled })
                      )
                    }
                    className="command-palette-item"
                  >
                    <Mail size={18} />
                    <span>Toggle Gmail Widget</span>
                    <span className="command-palette-badge">
                      {config.gmail.enabled ? 'On' : 'Off'}
                    </span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() =>
                      handleCommand(() =>
                        updateWidgetConfig('calendar', { enabled: !config.calendar.enabled })
                      )
                    }
                    className="command-palette-item"
                    disabled
                  >
                    <Calendar size={18} />
                    <span>Toggle Calendar Widget</span>
                    <span className="command-palette-badge">Coming Soon</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Account" className="command-palette-group">
                  <Command.Item
                    onSelect={() =>
                      handleCommand(async () => {
                        await logout();
                        navigate('/login');
                      })
                    }
                    className="command-palette-item command-palette-item-danger"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="command-palette-footer">
                <kbd>↑↓</kbd> Navigate
                <kbd>↵</kbd> Select
                <kbd>ESC</kbd> Close
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
