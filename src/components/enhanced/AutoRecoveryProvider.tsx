
import React, { Component, ReactNode } from 'react';
import { SelfHealingErrorBoundary } from './SelfHealingErrorBoundary';
import { moduleReloader } from '@/utils/moduleReloader';
import { contextReloader } from '@/utils/contextReloader';
import { DebugLogger } from '@/utils/debugLogger';

interface Props {
  children: ReactNode;
  recoveryLevel?: 'aggressive' | 'conservative' | 'manual';
  enableModuleReloading?: boolean;
  enableContextRecovery?: boolean;
}

interface State {
  recoveryCount: number;
  lastRecoveryTime: number;
  criticalErrors: string[];
}

export class AutoRecoveryProvider extends Component<Props, State> {
  private recoveryInterval?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      recoveryCount: 0,
      lastRecoveryTime: 0,
      criticalErrors: []
    };
  }

  componentDidMount() {
    this.setupGlobalErrorHandling();
    
    // Start periodic health checks
    this.recoveryInterval = setInterval(this.performHealthCheck, 30000); // Every 30 seconds
  }

  componentWillUnmount() {
    if (this.recoveryInterval) {
      clearInterval(this.recoveryInterval);
    }
    this.cleanupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling = () => {
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  };

  private cleanupGlobalErrorHandling = () => {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  };

  private handleGlobalError = (event: ErrorEvent) => {
    DebugLogger.error('AutoRecoveryProvider: Global error detected', new Error(event.message), {
      component: 'AutoRecoveryProvider',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });

    this.attemptGlobalRecovery(event.error);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    DebugLogger.error('AutoRecoveryProvider: Unhandled promise rejection', new Error(String(event.reason)), {
      component: 'AutoRecoveryProvider',
      reason: event.reason
    });

    this.attemptGlobalRecovery(new Error(String(event.reason)));
  };

  private attemptGlobalRecovery = async (error: Error) => {
    const { enableModuleReloading = true, enableContextRecovery = true, recoveryLevel = 'conservative' } = this.props;

    if (recoveryLevel === 'manual') {
      return; // Don't attempt automatic recovery
    }

    try {
      this.setState(prevState => ({
        recoveryCount: prevState.recoveryCount + 1,
        lastRecoveryTime: Date.now()
      }));

      // Module recovery
      if (enableModuleReloading) {
        const failedModules = moduleReloader.getFailedModules();
        if (failedModules.length > 0) {
          DebugLogger.info('AutoRecoveryProvider: Attempting to reload failed modules', {
            component: 'AutoRecoveryProvider',
            failedModules
          });
          
          for (const modulePath of failedModules) {
            try {
              await moduleReloader.reloadModule(modulePath, { retryCount: 2 });
            } catch (moduleError) {
              console.warn(`Failed to reload module ${modulePath}:`, moduleError);
            }
          }
        }
      }

      // Context recovery
      if (enableContextRecovery) {
        const recoveryResults = await contextReloader.recoverAllContexts();
        DebugLogger.info('AutoRecoveryProvider: Context recovery completed', {
          component: 'AutoRecoveryProvider',
          results: recoveryResults
        });
      }

      DebugLogger.info('AutoRecoveryProvider: Global recovery attempt completed', {
        component: 'AutoRecoveryProvider',
        recoveryCount: this.state.recoveryCount + 1
      });

    } catch (recoveryError) {
      DebugLogger.error('AutoRecoveryProvider: Global recovery failed', recoveryError as Error, {
        component: 'AutoRecoveryProvider'
      });

      this.setState(prevState => ({
        criticalErrors: [...prevState.criticalErrors, error.message]
      }));
    }
  };

  private performHealthCheck = async () => {
    try {
      // Check for memory leaks
      if (typeof window !== 'undefined' && (window.performance as any).memory) {
        const memory = (window.performance as any).memory;
        const usagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usagePercent > 0.9) {
          DebugLogger.warn('AutoRecoveryProvider: High memory usage detected', {
            component: 'AutoRecoveryProvider',
            usagePercent: Math.round(usagePercent * 100)
          });
          
          // Trigger garbage collection if available
          if ((window as any).gc) {
            (window as any).gc();
          }
        }
      }

      // Check for failed modules
      const failedModules = moduleReloader.getFailedModules();
      if (failedModules.length > 0 && this.props.enableModuleReloading) {
        await this.attemptModuleRecovery(failedModules);
      }

    } catch (error) {
      DebugLogger.warn('AutoRecoveryProvider: Health check failed', {
        component: 'AutoRecoveryProvider',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  private attemptModuleRecovery = async (failedModules: string[]) => {
    for (const modulePath of failedModules) {
      try {
        await moduleReloader.reloadModule(modulePath, { retryCount: 1 });
        DebugLogger.info(`AutoRecoveryProvider: Successfully recovered module ${modulePath}`, {
          component: 'AutoRecoveryProvider'
        });
      } catch (error) {
        DebugLogger.warn(`AutoRecoveryProvider: Failed to recover module ${modulePath}`, {
          component: 'AutoRecoveryProvider',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  };

  private handleRecovery = () => {
    DebugLogger.info('AutoRecoveryProvider: Component recovery triggered', {
      component: 'AutoRecoveryProvider'
    });
  };

  render() {
    const { children, recoveryLevel = 'conservative' } = this.props;

    return (
      <SelfHealingErrorBoundary
        healingStrategy={recoveryLevel}
        onRecovery={this.handleRecovery}
        componentName="AutoRecoveryProvider"
        maxRetries={recoveryLevel === 'aggressive' ? 5 : 3}
        retryDelay={recoveryLevel === 'aggressive' ? 1000 : 2000}
      >
        {children}
      </SelfHealingErrorBoundary>
    );
  }
}

export default AutoRecoveryProvider;
