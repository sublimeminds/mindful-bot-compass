import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class SafeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`SafeErrorBoundary (${this.props.name || 'Unknown'}):`, error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private getInlineStyles() {
    return {
      container: {
        minHeight: '200px',
        padding: '20px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        textAlign: 'center' as const,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: '16px'
      },
      heading: {
        color: '#dc2626',
        fontSize: '18px',
        marginBottom: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      },
      text: {
        color: '#7f1d1d',
        fontSize: '14px',
        marginBottom: '16px',
        lineHeight: '1.5'
      },
      buttonContainer: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap' as const
      },
      button: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      },
      debugBox: {
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '4px',
        fontSize: '12px',
        textAlign: 'left' as const,
        overflow: 'auto',
        maxHeight: '200px'
      }
    };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use inline styles for maximum safety - no dependencies on CSS classes
      const styles = this.getInlineStyles();
      const componentName = this.props.name || 'Component';

      return (
        <div style={styles.container}>
          <h3 style={styles.heading}>
            ⚠️ {componentName} Error
          </h3>
          <p style={styles.text}>
            {this.state.error?.message || 'This component encountered an error and couldn\'t load properly.'}
          </p>
          <div style={styles.buttonContainer}>
            <button 
              style={styles.button}
              onClick={this.handleRetry}
            >
              🔄 Try Again
            </button>
            <button 
              style={styles.button}
              onClick={() => window.location.reload()}
            >
              🔃 Reload Page
            </button>
            <button 
              style={styles.button}
              onClick={() => window.location.href = '/'}
            >
              🏠 Go Home
            </button>
          </div>
          
          {import.meta.env.DEV && this.state.error && (
            <div style={styles.debugBox}>
              <strong>Debug Info:</strong>
              <pre>{this.state.error.message}</pre>
              {this.state.error.stack && (
                <pre style={{ marginTop: '8px', fontSize: '11px' }}>
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeErrorBoundary;