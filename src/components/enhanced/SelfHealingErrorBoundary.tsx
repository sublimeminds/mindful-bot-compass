
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Shield, Zap } from 'lucide-react';
import { DebugLogger } from '@/utils/debugLogger';

interface Props {
  children: ReactNode;
  maxRetries?: number;
  retryDelay?: number;
  onRecovery?: () => void;
  componentName?: string;
  healingStrategy?: 'aggressive' | 'conservative' | 'manual';
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
  isRecovering: boolean;
  lastErrorTime: number;
  recoveryAttempts: number;
}

export class SelfHealingErrorBoundary extends Component<Props, State> {
  private retryTimer?: NodeJS.Timeout;
  private healingTimer?: NodeJS.Timeout;
  private maxRetries: number;
  private retryDelay: number;

  constructor(props: Props) {
    super(props);
    this.maxRetries = props.maxRetries || 3;
    this.retryDelay = props.retryDelay || 2000;
    
    this.state = {
      hasError: false,
      retryCount: 0,
      isRecovering: false,
      lastErrorTime: 0,
      recoveryAttempts: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName = 'Unknown', healingStrategy = 'conservative' } = this.props;
    
    DebugLogger.error(`SelfHealingErrorBoundary: Error in ${componentName}`, error, {
      component: componentName,
      errorInfo,
      retryCount: this.state.retryCount,
      healingStrategy
    });

    // Start automatic recovery based on strategy
    if (healingStrategy !== 'manual') {
      this.initiateRecovery();
    }
  }

  private initiateRecovery = () => {
    const { healingStrategy = 'conservative' } = this.props;
    
    if (this.state.retryCount >= this.maxRetries) {
      DebugLogger.warn('SelfHealingErrorBoundary: Max retries reached, switching to manual mode', {
        component: this.props.componentName,
        retryCount: this.state.retryCount
      });
      return;
    }

    this.setState({ isRecovering: true });

    // Different recovery strategies
    const delay = healingStrategy === 'aggressive' 
      ? this.retryDelay 
      : this.retryDelay * Math.pow(2, this.state.retryCount); // Exponential backoff

    this.retryTimer = setTimeout(() => {
      this.performRecovery();
    }, delay);
  };

  private performRecovery = async () => {
    try {
      // Clear any cached modules or contexts that might be causing issues
      this.clearErrorState();
      
      // Attempt to reload the component
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
        isRecovering: false,
        recoveryAttempts: prevState.recoveryAttempts + 1
      }));

      // Call recovery callback
      this.props.onRecovery?.();

      DebugLogger.info('SelfHealingErrorBoundary: Recovery attempt successful', {
        component: this.props.componentName,
        retryCount: this.state.retryCount + 1
      });

    } catch (recoveryError) {
      DebugLogger.error('SelfHealingErrorBoundary: Recovery failed', recoveryError as Error, {
        component: this.props.componentName
      });
      
      this.setState({ isRecovering: false });
      
      // Try again if we haven't exceeded max retries
      if (this.state.retryCount < this.maxRetries) {
        this.initiateRecovery();
      }
    }
  };

  private clearErrorState = () => {
    // Clear any error-related state or caches
    if (typeof window !== 'undefined') {
      // Clear any module caches if needed
      const errorKeys = Object.keys(localStorage).filter(key => 
        key.includes('error') || key.includes('crash')
      );
      errorKeys.forEach(key => localStorage.removeItem(key));
    }
  };

  private handleManualRecovery = () => {
    this.performRecovery();
  };

  private handleForceRefresh = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    if (this.healingTimer) {
      clearTimeout(this.healingTimer);
    }
  }

  render() {
    const { children, healingStrategy = 'conservative', componentName = 'Component' } = this.props;
    const { hasError, error, retryCount, isRecovering, recoveryAttempts } = this.state;

    if (hasError) {
      const canRetry = retryCount < this.maxRetries;
      const isAutoHealing = healingStrategy !== 'manual' && canRetry;

      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Shield className="h-5 w-5 mr-2" />
              Self-Healing Error Recovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {componentName} encountered an error and is attempting automatic recovery.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Recovery attempts:</span>
                <span className="font-mono">{recoveryAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span>Retry count:</span>
                <span className="font-mono">{retryCount}/{this.maxRetries}</span>
              </div>
              <div className="flex justify-between">
                <span>Strategy:</span>
                <span className="capitalize">{healingStrategy}</span>
              </div>
            </div>

            {isRecovering && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Attempting automatic recovery...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800 font-medium">Error:</p>
                <p className="text-xs text-red-700 font-mono">{error.message}</p>
              </div>
            )}

            <div className="flex space-x-2">
              {(!isAutoHealing || !canRetry) && (
                <Button 
                  onClick={this.handleManualRecovery}
                  disabled={isRecovering}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isRecovering ? 'Recovering...' : 'Try Recovery'}
                </Button>
              )}
              
              <Button 
                onClick={this.handleForceRefresh}
                variant="outline"
                size="sm"
              >
                Force Refresh
              </Button>
            </div>

            {!canRetry && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  Automatic recovery failed. Manual intervention may be required.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      );
    }

    return children;
  }
}

export default SelfHealingErrorBoundary;
