import { Clock } from '@/components/Clock';
import { useGmail } from '@/hooks/useGmail';
import { Mail, Calendar } from 'lucide-react';
import '../../styles/clock.css';
import '../../styles/prototype-v3.css';

/**
 * Prototype V3: Clock with Floating Cards
 * - Fullscreen clock background
 * - Floating widget cards in corners
 * - Minimal, ambient display
 */
export default function PrototypeV3() {
  const { emails, isLoading } = useGmail({ enabled: true, refetchInterval: 60000 });

  return (
    <div className="prototype-v3">
      {/* Background: Giant Clock */}
      <div className="clock-background">
        <Clock size="hero" showDate={true} />
      </div>

      {/* Floating Cards */}
      <div className="floating-cards">
        {/* Top Right: Gmail Card */}
        <div className="floating-card floating-card-top-right">
          <div className="floating-card-header">
            <Mail className="w-4 h-4" />
            <span>Gmail</span>
          </div>
          <div className="floating-card-value">{isLoading ? '...' : emails.length}</div>
          <div className="floating-card-label">unread</div>
        </div>

        {/* Bottom Right: Calendar Card */}
        <div className="floating-card floating-card-bottom-right">
          <div className="floating-card-header">
            <Calendar className="w-4 h-4" />
            <span>Today</span>
          </div>
          <div className="floating-card-value">3</div>
          <div className="floating-card-label">events</div>
        </div>
      </div>
    </div>
  );
}
