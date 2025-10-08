import { Loader2 } from 'lucide-react';

/**
 * Loading state for route authentication check
 * Centered spinner with minimal design
 */
export function RouteLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0A0A',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Loader2
          style={{
            width: '2rem',
            height: '2rem',
            color: '#60A5FA',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
