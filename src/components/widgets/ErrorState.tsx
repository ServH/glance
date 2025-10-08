import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Reusable error state component
 * Shows error message with retry button
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <AlertTriangle className="error-state-icon" />
      <p className="error-state-message">{error}</p>
      <Button onClick={onRetry} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
