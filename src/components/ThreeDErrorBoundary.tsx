import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showRefresh?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ThreeDErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log WebGL context loss specifically
    if (error.message?.includes('WebGL') || error.message?.includes('lov')) {
      console.warn('3D component WebGL context lost:', error);
    }
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
              <div>
                <h3 className="text-sm font-medium text-therapy-700 mb-1">
                  3D Display Unavailable
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  The 3D avatar cannot be rendered at this time.
                </p>
                {this.props.showRefresh && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={this.handleRefresh}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ThreeDErrorBoundary;