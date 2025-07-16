
import React, { useState, useEffect, ReactNode } from 'react';

interface ReactSafeWrapperProps {
  children: ReactNode;
}

const ReactSafeWrapper: React.FC<ReactSafeWrapperProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkReactReadiness = () => {
      try {
        // Simple React readiness check
        if (
          typeof React !== 'undefined' &&
          React !== null &&
          typeof React.createElement === 'function' &&
          typeof React.useState === 'function' &&
          typeof React.useEffect === 'function'
        ) {
          setIsReactReady(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error('React readiness check failed:', error);
        return false;
      }
    };

    if (!checkReactReadiness() && attempts < 10) {
      const timeout = setTimeout(() => {
        setAttempts(prev => prev + 1);
      }, 100); // Retry every 100ms
      
      return () => clearTimeout(timeout);
    } else if (attempts >= 10) {
      // If React is still not ready after 10 attempts, reload
      window.location.reload();
    }
  }, [attempts]);

  if (!isReactReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactSafeWrapper;
