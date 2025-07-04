import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

interface ReactHealthState {
  isHealthy: boolean;
  lastCheck: number;
  errors: string[];
  warnings: string[];
  diagnostics: Record<string, any>;
}

class ReactHealthMonitor extends React.Component<{}, ReactHealthState> {
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private mountTime: number;

  constructor(props: {}) {
    super(props);
    this.mountTime = Date.now();
    this.state = {
      isHealthy: true,
      lastCheck: 0,
      errors: [],
      warnings: [],
      diagnostics: {}
    };
  }

  componentDidMount() {
    console.log('ReactHealthMonitor: Starting React health monitoring');
    this.performHealthCheck();
    
    // Check React health every 5 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 5000);

    // Expose to window for debugging
    (window as any).reactHealthMonitor = {
      getState: () => this.state,
      forceCheck: () => this.performHealthCheck(),
      getDiagnostics: () => reactHookValidator.getDiagnostics()
    };
  }

  componentWillUnmount() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  private performHealthCheck = () => {
    try {
      console.log('ReactHealthMonitor: Performing health check...');
      
      const validation = reactHookValidator.validateReactContext();
      const diagnostics = reactHookValidator.getDiagnostics();
      
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!validation.isValid) {
        errors.push(validation.error || 'Unknown React validation error');
        if (validation.suggestions) {
          warnings.push(...validation.suggestions);
        }
      }

      // Check for React availability
      if (!diagnostics.reactAvailable) {
        errors.push('React is not available in global scope');
      }

      if (!diagnostics.hooksAvailable) {
        errors.push('React hooks are not available');
      }

      // Check dispatcher health
      if (diagnostics.dispatcher && !diagnostics.dispatcher.available) {
        errors.push('React dispatcher is not available - components may fail to render');
      }

      const isHealthy = errors.length === 0;
      
      console.log('ReactHealthMonitor: Health check result:', { 
        isHealthy, 
        errors: errors.length, 
        warnings: warnings.length 
      });

      this.setState({
        isHealthy,
        lastCheck: Date.now(),
        errors,
        warnings,
        diagnostics
      });

      // Auto-recovery attempt if unhealthy
      if (!isHealthy && this.mountTime + 10000 < Date.now()) {
        console.warn('ReactHealthMonitor: Attempting auto-recovery...');
        this.attemptRecovery();
      }

    } catch (error) {
      console.error('ReactHealthMonitor: Health check failed:', error);
      this.setState({
        isHealthy: false,
        lastCheck: Date.now(),
        errors: [`Health check failed: ${(error as Error).message}`],
        warnings: ['React monitoring system encountered an error'],
        diagnostics: {}
      });
    }
  };

  private attemptRecovery = () => {
    try {
      console.log('ReactHealthMonitor: Attempting React context recovery...');
      
      // Reset hook tracking
      reactHookValidator.resetTracking();
      
      // Force a re-render to potentially restore React context
      this.forceUpdate();
      
      // Wait a bit then re-check
      setTimeout(() => {
        this.performHealthCheck();
      }, 1000);
      
    } catch (error) {
      console.error('ReactHealthMonitor: Recovery attempt failed:', error);
    }
  };

  render() {
    const { isHealthy, lastCheck, errors, warnings } = this.state;

    // Don't render anything if healthy - this is a background monitor
    if (isHealthy) {
      return null;
    }

    // Show warning banner for unhealthy React state
    return (
      <div 
        className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-2 text-sm"
        style={{ zIndex: 9999 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">React Health Issue Detected</span>
          </div>
          <div className="text-xs opacity-75">
            Last check: {new Date(lastCheck).toLocaleTimeString()}
          </div>
        </div>
        {errors.length > 0 && (
          <div className="mt-1 text-xs opacity-90">
            {errors[0]} {errors.length > 1 && `(+${errors.length - 1} more)`}
          </div>
        )}
      </div>
    );
  }
}

export default ReactHealthMonitor;