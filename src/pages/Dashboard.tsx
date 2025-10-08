import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { GmailWidget } from '@/components/widgets/GmailWidget';
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

          <p className="dashboard-subtitle">Your personalized second screen dashboard</p>

          {/* Widget grid */}
          <div className="widget-grid">
            {/* Gmail Widget - E2.S2 */}
            <GmailWidget />

            {/* Placeholder widgets */}
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
