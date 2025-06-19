
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Clock, Code } from 'lucide-react';

interface ErrorEntry {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  severity: 'low' | 'medium' | 'high';
  count: number;
}

const ErrorTracker = () => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (!isTracking) return;

      const newError: ErrorEntry = {
        id: Date.now().toString(),
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        severity: event.error?.name === 'TypeError' ? 'high' : 'medium',
        count: 1
      };

      setErrors(prev => {
        // Check if this error already exists
        const existingIndex = prev.findIndex(e => e.message === newError.message);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            count: updated[existingIndex].count + 1,
            timestamp: newError.timestamp
          };
          return updated;
        }
        return [newError, ...prev].slice(0, 10); // Keep only last 10 errors
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isTracking) return;

      const newError: ErrorEntry = {
        id: Date.now().toString(),
        message: `Promise rejection: ${event.reason}`,
        timestamp: new Date(),
        severity: 'high',
        count: 1
      };

      setErrors(prev => [newError, ...prev].slice(0, 10));
    };

    if (isTracking) {
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isTracking]);

  const clearErrors = () => {
    setErrors([]);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Error Tracker ({errors.length})
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? 'Active' : 'Paused'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTracking(!isTracking)}
            >
              {isTracking ? 'Pause' : 'Resume'}
            </Button>
            {errors.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearErrors}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {errors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No errors detected</p>
            <p className="text-sm">Your application is running smoothly!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {errors.map((error) => (
              <div key={error.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </Badge>
                      {error.count > 1 && (
                        <Badge variant="outline" className="text-xs">
                          {error.count}x
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {error.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {error.message}
                    </p>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer flex items-center">
                          <Code className="h-3 w-3 mr-1" />
                          Stack trace
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-gray-50 rounded overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeError(error.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorTracker;
