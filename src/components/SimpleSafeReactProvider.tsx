
import React, { Component, ReactNode } from 'react';
import { advancedReactValidator } from '@/utils/advancedReactValidator';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  isReactReady: boolean;
  validationReport: any;
  error?: Error;
  isLoading: boolean;
}

// Ultra-safe React provider using advanced validation
export class SimpleSafeReactProvider extends Component<Props, State> {
  private mounted = true;
  
  public state: State = {
    isReactReady: false,
    validationReport: null,
    error: undefined,
    isLoading: true
  };

  public async componentDidMount() {
    try {
      console.log('SimpleSafeReactProvider: Starting advanced React validation...');
      
      // Use advanced validator to ensure React is truly ready
      const report = await advancedReactValidator.waitForReactReady();
      
      if (!this.mounted) return;

      if (report.isReady) {
        console.log('SimpleSafeReactProvider: React validation successful', report);
        this.setState({
          isReactReady: true,
          validationReport: report,
          isLoading: false
        });
      } else {
        throw new Error(`React initialization failed: ${report.hooks.filter(h => !h.isExecutable).map(h => h.name).join(', ')} not ready`);
      }
    } catch (error) {
      console.error('SimpleSafeReactProvider: React validation failed', error);
      
      if (this.mounted) {
        this.setState({
          isReactReady: false,
          error: error as Error,
          isLoading: false
        });
      }
    }
  }

  public componentWillUnmount() {
    this.mounted = false;
  }

  private handleRetry = () => {
    console.log('SimpleSafeReactProvider: User triggered retry');
    this.setState({
      isLoading: true,
      error: undefined,
      isReactReady: false
    });
    
    // Clear cache and retry
    advancedReactValidator.clearCache();
    this.componentDidMount();
  };

  private handleReload = () => {
    console.log('SimpleSafeReactProvider: User triggered page reload');
    window.location.reload();
  };

  public render() {
    const { children, fallback } = this.props;
    const { isReactReady, error, isLoading, validationReport } = this.state;

    if (error) {
      if (fallback) {
        return fallback;
      }

      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }
      }, React.createElement('div', {
        style: {
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: { color: '#dc2626', marginBottom: '20px', fontSize: '24px' }
        }, '⚠️ React Initialization Error'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#666', marginBottom: '20px', lineHeight: '1.5' }
        }, 'The React framework failed to initialize properly. This prevents the application from running safely.'),
        React.createElement('div', {
          key: 'error-details',
          style: { 
            backgroundColor: '#fef3c7', 
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'left'
          }
        }, [
          React.createElement('h4', {
            key: 'error-title',
            style: { margin: '0 0 10px 0', color: '#92400e' }
          }, 'Technical Details:'),
          React.createElement('p', {
            key: 'error-text',
            style: { margin: 0, color: '#92400e', fontSize: '14px' }
          }, error.message)
        ]),
        validationReport && React.createElement('div', {
          key: 'validation-details',
          style: { 
            backgroundColor: '#f3f4f6', 
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'left'
          }
        }, [
          React.createElement('h4', {
            key: 'validation-title',
            style: { margin: '0 0 10px 0', color: '#374151' }
          }, 'Hook Status:'),
          ...validationReport.hooks.map((hook: any, index: number) => 
            React.createElement('div', {
              key: `hook-${index}`,
              style: { 
                fontSize: '13px',
                color: hook.isExecutable ? '#059669' : '#dc2626',
                marginBottom: '3px'
              }
            }, `${hook.isExecutable ? '✅' : '❌'} ${hook.name}: ${hook.isExecutable ? 'Ready' : (hook.error || 'Not ready')}`)
          )
        ]),
        React.createElement('div', {
          key: 'buttons',
          style: { display: 'flex', gap: '10px', justifyContent: 'center' }
        }, [
          React.createElement('button', {
            key: 'retry',
            onClick: this.handleRetry,
            style: {
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }
          }, 'Retry Initialization'),
          React.createElement('button', {
            key: 'reload',
            onClick: this.handleReload,
            style: {
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }
          }, 'Reload Page')
        ])
      ]));
    }

    if (isLoading || !isReactReady) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }
      }, React.createElement('div', {
        style: {
          textAlign: 'center'
        }
      }, [
        React.createElement('div', {
          key: 'spinner',
          style: {
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }
        }),
        React.createElement('p', {
          key: 'text',
          style: { color: '#6b7280', fontSize: '16px' }
        }, 'Initializing React framework...')
      ]));
    }

    return children;
  }
}

export default SimpleSafeReactProvider;
