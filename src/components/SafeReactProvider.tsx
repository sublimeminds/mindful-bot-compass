
import React, { Component, ReactNode } from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import { appHealthChecker } from '@/utils/appHealthChecker';
import { DebugLogger } from '@/utils/debugLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  isReactSafe: boolean;
  healthStatus: any;
  error?: Error;
  retryCount: number;
}

export class SafeReactProvider extends Component<Props, State> {
  private maxRetries = 3;
  
  public state: State = {
    isReactSafe: false,
    healthStatus: null,
    retryCount: 0
  };

  async componentDidMount() {
    await this.performHealthCheck();
  }

  private performHealthCheck = async () => {
    try {
      DebugLogger.info('SafeReactProvider: Starting health check', {
        component: 'SafeReactProvider'
      });

      // Run comprehensive health checks
      const healthStatus = await appHealthChecker.runStartupHealthChecks();
      
      // Check if React is safe to use
      const reactValidation = reactHookValidator.validateReactInit();
      const contextValidation = reactHookValidator.validateReactContext();
      
      const isReactSafe = reactValidation.isValid && contextValidation.isValid;
      
      if (!isReactSafe && this.state.retryCount < this.maxRetries) {
        DebugLogger.warn('SafeReactProvider: React not safe, attempting retry', {
          component: 'SafeReactProvider',
          retryCount: this.state.retryCount,
          reactValidation,
          contextValidation
        });

        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (this.state.retryCount + 1)));
        
        this.setState(prevState => ({
          retryCount: prevState.retryCount + 1
        }));
        
        await this.performHealthCheck();
        return;
      }

      this.setState({
        isReactSafe,
        healthStatus,
        error: isReactSafe ? undefined : new Error('React initialization failed after retries')
      });

      if (isReactSafe) {
        DebugLogger.info('SafeReactProvider: React is safe to use', {
          component: 'SafeReactProvider',
          healthStatus: healthStatus.overall
        });
      } else {
        DebugLogger.error('SafeReactProvider: React is not safe to use', new Error('React validation failed'), {
          component: 'SafeReactProvider',
          healthStatus,
          retryCount: this.state.retryCount
        });
      }
    } catch (error) {
      DebugLogger.error('SafeReactProvider: Health check failed', error as Error, {
        component: 'SafeReactProvider'
      });
      
      this.setState({
        isReactSafe: false,
        error: error as Error
      });
    }
  };

  private handleRetry = () => {
    this.setState({
      retryCount: 0,
      error: undefined
    });
    this.performHealthCheck();
  };

  public render() {
    const { children, fallback } = this.props;
    const { isReactSafe, error, healthStatus } = this.state;

    if (!isReactSafe) {
      if (fallback) {
        return fallback;
      }

      // Safe fallback that doesn't use React hooks
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }
      }, React.createElement('div', {
        style: {
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: { color: '#dc2626', marginBottom: '20px' }
        }, '⚠️ Application Initialization Error'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#666', marginBottom: '20px' }
        }, error?.message || 'The application failed to initialize properly. This is usually a temporary issue.'),
        healthStatus && React.createElement('div', {
          key: 'health',
          style: { 
            backgroundColor: '#f9fafb', 
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'left'
          }
        }, [
          React.createElement('h3', {
            key: 'health-title',
            style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }
          }, 'System Health Check Results:'),
          ...healthStatus.checks.map((check: any, index: number) => 
            React.createElement('div', {
              key: `check-${index}`,
              style: { 
                marginBottom: '5px',
                fontSize: '13px',
                color: check.status === 'pass' ? '#059669' : check.status === 'warn' ? '#d97706' : '#dc2626'
              }
            }, `${check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌'} ${check.name}: ${check.message}`)
          )
        ]),
        React.createElement('button', {
          key: 'retry',
          onClick: this.handleRetry,
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }
        }, 'Try Again'),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          style: {
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }
        }, 'Reload Page')
      ]));
    }

    return children;
  }
}

export default SafeReactProvider;
