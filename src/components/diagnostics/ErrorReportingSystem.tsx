import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

interface ErrorReportingSystemState {
  errors: Array<{
    id: string;
    timestamp: number;
    type: 'react-hook' | 'component' | 'network' | 'runtime';
    message: string;
    stack?: string;
    componentStack?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
    metadata?: Record<string, any>;
  }>;
  isCollecting: boolean;
  autoReport: boolean;
}

class ErrorReportingSystem extends React.Component<{}, ErrorReportingSystemState> {
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;
  private errorHandler: ((event: ErrorEvent) => void) | null = null;

  constructor(props: {}) {
    super(props);
    
    this.originalConsoleError = console.error.bind(console);
    this.originalConsoleWarn = console.warn.bind(console);
    
    this.state = {
      errors: [],
      isCollecting: true,
      autoReport: false
    };
  }

  componentDidMount() {
    if (this.state.isCollecting) {
      this.startErrorCollection();
    }

    // Expose to window for debugging
    (window as any).errorReportingSystem = {
      getErrors: () => this.state.errors,
      clearErrors: () => this.setState({ errors: [] }),
      exportErrors: () => this.exportErrors(),
      toggleCollection: () => this.toggleCollection(),
      reportError: (error: Error, metadata?: any) => this.captureError(error, 'runtime', 'high', metadata)
    };
  }

  componentWillUnmount() {
    this.stopErrorCollection();
  }

  private startErrorCollection = () => {
    // Intercept console errors
    console.error = (...args) => {
      this.handleConsoleError(args);
      this.originalConsoleError(...args);
    };

    console.warn = (...args) => {
      this.handleConsoleWarn(args);
      this.originalConsoleWarn(...args);
    };

    // Handle unhandled promise rejections
    this.unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'runtime',
        'high',
        { reason: event.reason }
      );
    };
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);

    // Handle uncaught errors
    this.errorHandler = (event: ErrorEvent) => {
      this.captureError(
        new Error(event.message),
        'runtime',
        'critical',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    };
    window.addEventListener('error', this.errorHandler);

    console.log('ErrorReportingSystem: Started error collection');
  };

  private stopErrorCollection = () => {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;

    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
    }

    if (this.errorHandler) {
      window.removeEventListener('error', this.errorHandler);
    }

    console.log('ErrorReportingSystem: Stopped error collection');
  };

  private handleConsoleError = (args: any[]) => {
    const message = args.join(' ');
    
    // Check if it's a React hook error
    if (message.includes('Invalid hook call') || message.includes('useContext') || message.includes('useState')) {
      this.captureError(
        new Error(message),
        'react-hook',
        'critical',
        {
          args,
          reactValidation: reactHookValidator.validateReactContext(),
          diagnostics: reactHookValidator.getDiagnostics()
        }
      );
    } else if (message.includes('Warning:')) {
      // React warnings
      this.captureError(
        new Error(message),
        'component',
        'medium',
        { args, source: 'React Warning' }
      );
    } else {
      // General errors
      this.captureError(
        new Error(message),
        'runtime',
        'high',
        { args }
      );
    }
  };

  private handleConsoleWarn = (args: any[]) => {
    const message = args.join(' ');
    
    this.captureError(
      new Error(message),
      'runtime',
      'low',
      { args, source: 'Console Warning' }
    );
  };

  private captureError = (
    error: Error,
    type: ErrorReportingSystemState['errors'][0]['type'],
    severity: ErrorReportingSystemState['errors'][0]['severity'],
    metadata?: Record<string, any>
  ) => {
    const errorEntry = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      message: error.message,
      stack: error.stack,
      severity,
      resolved: false,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    };

    this.setState(prevState => ({
      errors: [errorEntry, ...prevState.errors].slice(0, 100) // Keep last 100 errors
    }));

    // Auto-report critical errors if enabled
    if (this.state.autoReport && severity === 'critical') {
      this.sendErrorReport(errorEntry);
    }
  };

  private sendErrorReport = async (error: ErrorReportingSystemState['errors'][0]) => {
    try {
      // In a real application, you would send this to your error reporting service
      console.log('ErrorReportingSystem: Would send error report:', error);
      
      // For now, just log to localStorage for debugging
      const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingReports.push(error);
      localStorage.setItem('error_reports', JSON.stringify(existingReports.slice(-50))); // Keep last 50
      
    } catch (reportError) {
      console.error('ErrorReportingSystem: Failed to send error report:', reportError);
    }
  };

  private exportErrors = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      errors: this.state.errors,
      systemInfo: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        reactHealth: reactHookValidator.validateReactContext(),
        diagnostics: reactHookValidator.getDiagnostics()
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private toggleCollection = () => {
    const newCollecting = !this.state.isCollecting;
    
    this.setState({ isCollecting: newCollecting });
    
    if (newCollecting) {
      this.startErrorCollection();
    } else {
      this.stopErrorCollection();
    }
  };

  private getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  render() {
    // This is a background system, only render in development
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    const { errors, isCollecting } = this.state;
    const criticalErrors = errors.filter(e => e.severity === 'critical' && !e.resolved);

    // Show warning for critical errors
    if (criticalErrors.length > 0) {
      return (
        <div className="fixed top-16 left-0 right-0 z-40 bg-red-600 text-white p-2 text-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {criticalErrors.length} Critical Error{criticalErrors.length > 1 ? 's' : ''} Detected
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span>Collection: {isCollecting ? 'ON' : 'OFF'}</span>
              <button
                onClick={this.exportErrors}
                className="bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30"
              >
                Export
              </button>
            </div>
          </div>
          {criticalErrors.length > 0 && (
            <div className="mt-1 text-xs opacity-90">
              Latest: {criticalErrors[0].message.substring(0, 100)}...
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}

export default ErrorReportingSystem;