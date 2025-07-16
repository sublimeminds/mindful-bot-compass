
import React, { useState, useEffect } from 'react';

interface ReactSafeWrapperProps {
  children: React.ReactNode;
}

const ReactSafeWrapper: React.FC<ReactSafeWrapperProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    const checkReactReadiness = () => {
      try {
        // Comprehensive React readiness check
        const isReady = (
          typeof React !== 'undefined' &&
          React !== null &&
          typeof React.useState === 'function' &&
          typeof React.useEffect === 'function' &&
          typeof React.createElement === 'function' &&
          typeof React.Fragment !== 'undefined'
        );
        
        if (isReady) {
          console.log('ReactSafeWrapper: React is ready');
          setIsReactReady(true);
        } else if (attempts < 10) {
          console.warn(`ReactSafeWrapper: React not ready, attempt ${attempts + 1}`);
          setAttempts(prev => prev + 1);
          // Retry with exponential backoff
          setTimeout(checkReactReadiness, Math.min(1000 * Math.pow(2, attempts), 5000));
        } else {
          console.error('ReactSafeWrapper: React failed to initialize after 10 attempts');
          // Force reload as last resort
          window.location.reload();
        }
      } catch (error) {
        console.error('ReactSafeWrapper: Error checking React readiness:', error);
        if (attempts < 5) {
          setAttempts(prev => prev + 1);
          setTimeout(checkReactReadiness, 1000);
        } else {
          window.location.reload();
        }
      }
    };

    checkReactReadiness();
  }, [attempts]);

  // Show loading while React initializes
  if (!isReactReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing React... (Attempt {attempts + 1})</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactSafeWrapper;
