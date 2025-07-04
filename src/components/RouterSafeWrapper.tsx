import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface RouterSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Component that ensures Router context is available before rendering children
export const RouterSafeWrapper: React.FC<RouterSafeWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const [isRouterReady, setIsRouterReady] = useState(false);
  
  // Try to access router context
  let location: any = null;
  let routerError = false;
  
  try {
    location = useLocation();
  } catch (error) {
    routerError = true;
    console.warn('Router context not available in RouterSafeWrapper');
  }
  
  useEffect(() => {
    if (!routerError && location) {
      setIsRouterReady(true);
    } else {
      // Delay and retry
      const timer = setTimeout(() => {
        setIsRouterReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [routerError, location]);
  
  if (!isRouterReady) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Initializing...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};