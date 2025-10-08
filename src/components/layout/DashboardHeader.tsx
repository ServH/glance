import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import '../../styles/dashboard-header.css';

export function DashboardHeader() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      // Show error toast (to be implemented in E8 - Error Handling)
    }
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    navigate('/settings');
  };

  if (!user) {
    // Should never happen in protected routes, but TypeScript safety
    return null;
  }

  // Extract user info with fallbacks
  const displayName = user.displayName || 'User';
  const email = user.email || '';
  const photoURL = user.photoURL || '';

  // Generate initials from display name
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Truncate name if too long
  const truncatedName = displayName.length > 20 ? `${displayName.slice(0, 20)}...` : displayName;

  return (
    <header className="dashboard-header">
      <div className="header-content">
        {/* Logo / App Name */}
        <div className="header-logo">
          <h1 className="header-title">Glance</h1>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="profile-trigger" aria-label="User menu">
            <Avatar className="profile-avatar">
              <AvatarImage src={photoURL} alt={displayName} />
              <AvatarFallback className="profile-avatar-fallback">{initials}</AvatarFallback>
            </Avatar>

            <span className="profile-name">{truncatedName}</span>

            <ChevronDown className={`profile-chevron ${dropdownOpen ? 'rotated' : ''}`} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="profile-dropdown">
            {/* User Info */}
            <DropdownMenuLabel>
              <div className="dropdown-user-info">
                <span className="dropdown-user-name">{displayName}</span>
                <span className="dropdown-user-email">{email}</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Settings Option */}
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="dropdown-icon" />
              Settings
            </DropdownMenuItem>

            {/* Sign Out Option */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="dropdown-logout"
            >
              <LogOut className="dropdown-icon" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
