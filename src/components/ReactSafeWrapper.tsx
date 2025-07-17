
import React, { ReactNode, Component, ErrorInfo } from 'react';

interface ReactSafeWrapperProps {
  children: ReactNode;
}

interface ReactSafeWrapperState {
  hasError: boolean;
  errorMessage: string;
  retryCount: number;
}

class ReactSafeWrapper extends Component<ReactSafeWrapperProps, ReactSafeWrapperState> {
  private maxRetries = 3;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ReactSafeWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ReactSafeWrapperState> {
    console.error('🚨 ReactSafeWrapper caught error:', error);
    return {
      hasError: true,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ReactSafeWrapper Error Details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Check for specific React hook errors
    if (error.message.includes('useState') || error.message.includes('useEffect')) {
      console.error('🚨 HOOK ERROR DETECTED: React hooks not properly initialized');
      this.handleHookError();
    }
  }

  handleHookError = () => {
    // Clear any cached modules that might be causing issues
    try {
      const themeKeys = Object.keys(window).filter(key => 
        key.includes('theme') || key.includes('Theme')
      );
      themeKeys.forEach(key => {
        try {
          delete (window as any)[key];
        } catch (e) {
          // Ignore deletion errors
        }
      });
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }

    // Force reload if retries exhausted
    if (this.state.retryCount >= this.maxRetries) {
      console.error('🚨 Max retries exceeded, forcing page reload...');
      window.location.reload();
    }
  };

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      console.log(`🔄 Retrying ReactSafeWrapper (${this.state.retryCount + 1}/${this.maxRetries})`);
      
      this.setState(prevState => ({
        hasError: false,
        errorMessage: '',
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Application Error</h2>
            <p className="text-muted-foreground mb-6">
              {this.state.errorMessage.includes('useState') 
                ? 'React initialization error detected. This usually resolves automatically.'
                : 'An unexpected error occurred.'}
            </p>
            
            {this.state.retryCount < this.maxRetries ? (
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 mr-2"
              >
                Retry ({this.state.retryCount + 1}/{this.maxRetries})
              </button>
            ) : null}
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ReactSafeWrapper;
