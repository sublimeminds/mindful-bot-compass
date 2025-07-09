import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import BulletproofAvatar from './BulletproofAvatar';

interface AvatarErrorBoundaryProps {
  children: ReactNode;
  therapistId?: string;
  therapistName?: string;
  fallback?: ReactNode;
}

interface AvatarErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AvatarErrorBoundary extends Component<AvatarErrorBoundaryProps, AvatarErrorBoundaryState> {
  constructor(props: AvatarErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AvatarErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log avatar-specific errors
    console.error('Avatar Error Boundary caught error:', error, errorInfo);
    
    // Check if this is the 'lov' related error
    if (error.message.includes('lov') || error.message.includes('undefined')) {
      console.warn('Avatar rendering failed, falling back to 2D avatar');
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use BulletproofAvatar as default fallback
      if (this.props.therapistId && this.props.therapistName) {
        return (
          <div className="w-full h-full">
            <BulletproofAvatar
              therapistId={this.props.therapistId}
              therapistName={this.props.therapistName}
              className="w-full h-full"
              showName={false}
            />
          </div>
        );
      }

      // Generic error fallback
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Avatar unavailable</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AvatarErrorBoundary;