import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and prevents full app crash
 * Provides fallback UI and error logging
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (future: send to error tracking service like Sentry)
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Future: Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#FCA5A5',
                marginBottom: '1rem',
              }}
            >
              Oops! Something went wrong
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem',
                lineHeight: '1.6',
              }}
            >
              We're sorry, but something unexpected happened. The error has been logged and we'll
              look into it.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    fontSize: '0.875rem',
                    color: '#FCA5A5',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
