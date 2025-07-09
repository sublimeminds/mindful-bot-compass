import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BulletproofAvatar from './BulletproofAvatar';

interface Props {
  children: ReactNode;
  therapistId: string;
  therapistName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AvatarErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Avatar Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg p-4">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-sm font-medium text-therapy-700 mb-2 text-center">
            Avatar Loading Error
          </p>
          <p className="text-xs text-muted-foreground mb-4 text-center">
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
            
            {/* Fallback to bulletproof avatar */}
            <div className="mt-4">
              <BulletproofAvatar
                therapistId={this.props.therapistId}
                therapistName={this.props.therapistName}
                className="w-full h-full"
                showName={false}
                size="md"
              />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AvatarErrorBoundary;