import { DashboardHeader } from '@/components/layout/DashboardHeader';
import '../styles/settings.css';

export default function Settings() {
  return (
    <div className="settings-page">
      <DashboardHeader />

      <main className="settings-content">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Settings functionality will be implemented in Epic 6.</p>
      </main>
    </div>
  );
}
