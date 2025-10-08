import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuthContext } from '@/contexts/AuthContext';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <div className="dashboard">
      {/* Header with user profile */}
      <DashboardHeader />

      {/* Main content */}
      <main className="dashboard-content">
        <div className="dashboard-container">
          <h1 className="dashboard-welcome">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </h1>

          <p className="dashboard-subtitle">
            Your personalized dashboard is coming soon. Widgets for Gmail and Calendar will be
            implemented in the next epics.
          </p>

          {/* Placeholder widget grid */}
          <div className="widget-grid">
            <div className="widget-placeholder">
              <p className="widget-placeholder-text">Gmail Widget</p>
              <p className="widget-placeholder-subtitle">Epic 2</p>
            </div>

            <div className="widget-placeholder">
              <p className="widget-placeholder-text">Calendar Widget</p>
              <p className="widget-placeholder-subtitle">Epic 5</p>
            </div>

            <div className="widget-placeholder">
              <p className="widget-placeholder-text">Clock Widget</p>
              <p className="widget-placeholder-subtitle">Epic 3</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
