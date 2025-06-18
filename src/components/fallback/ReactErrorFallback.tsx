
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ReactErrorFallbackProps {
  error?: Error;
  onReload?: () => void;
}

const ReactErrorFallback: React.FC<ReactErrorFallbackProps> = ({ error, onReload }) => {
  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Application Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Something went wrong while loading the application. This is usually a temporary issue.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800 font-medium">Error Details:</p>
              <p className="text-xs text-red-700 mt-1 font-mono">{error.message}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={handleReload}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Try refreshing the page</p>
            <p>• Check your internet connection</p>
            <p>• Clear your browser cache if the problem persists</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReactErrorFallback;
