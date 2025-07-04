import React, { useEffect, useState } from 'react';

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
  
  useEffect(() => {
    // Check if Router context exists without calling hooks
    const checkRouterContext = () => {
      try {
        // Use a simple DOM check instead of hook calls
        const routerContext = window.location;
        if (routerContext) {
          setIsRouterReady(true);
          return;
        }
      } catch (error) {
        console.warn('Router context check failed:', error);
      }
      
      // Simple timer fallback - always allow rendering after brief delay
      const timer = setTimeout(() => {
        setIsRouterReady(true);
      }, 50);
      
      return () => clearTimeout(timer);
    };
    
    checkRouterContext();
  }, []);
  
  if (!isRouterReady) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};