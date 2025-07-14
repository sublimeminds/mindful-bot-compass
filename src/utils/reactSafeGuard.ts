import React from 'react';

// React Safety Guard - Prevents components from rendering when React isn't ready
export const isReactReady = (): boolean => {
  try {
    // Check if React is available and properly initialized
    if (typeof React === 'undefined' || React === null) {
      console.warn('isReactReady: React is undefined or null');
      return false;
    }
    if (typeof React.useState !== 'function') {
      console.warn('isReactReady: React.useState is not available');
      return false;
    }
    if (typeof React.useEffect !== 'function') {
      console.warn('isReactReady: React.useEffect is not available');
      return false;
    }
    if (typeof React.createContext !== 'function') {
      console.warn('isReactReady: React.createContext is not available');
      return false;
    }
    if (typeof React.useCallback !== 'function') {
      console.warn('isReactReady: React.useCallback is not available');
      return false;
    }
    
    console.log('isReactReady: All React hooks and functions are available');
    return true;
  } catch (error) {
    console.error('React readiness check failed:', error);
    return false;
  }
};

// Simple React readiness checker for components
export const checkReactReadiness = (componentName: string): boolean => {
  if (!isReactReady()) {
    console.warn(`Component ${componentName} rendered before React ready`);
    return false;
  }
  return true;
};

// Hook to check React readiness - uses safe React access
export const useReactReadiness = () => {
  // Don't use React hooks if React isn't ready
  if (!isReactReady()) {
    console.warn('useReactReadiness: React not ready, returning false');
    return false;
  }

  try {
    const [isReady, setIsReady] = React.useState(false);
    
    React.useEffect(() => {
      const checkReadiness = () => {
        if (isReactReady()) {
          setIsReady(true);
        } else {
          // Retry after a short delay
          setTimeout(checkReadiness, 100);
        }
      };
      
      checkReadiness();
    }, []);
    
    return isReady;
  } catch (error) {
    console.error('useReactReadiness: Error using React hooks:', error);
    return false;
  }
};

// Safe React hook executor
export const withReactSafety = <T extends any[], R>(
  hookFn: (...args: T) => R,
  fallbackValue: R,
  hookName: string
) => {
  return (...args: T): R => {
    if (!isReactReady()) {
      console.warn(`withReactSafety: ${hookName} called before React ready, using fallback`);
      return fallbackValue;
    }

    try {
      return hookFn(...args);
    } catch (error) {
      console.error(`withReactSafety: Error in ${hookName}:`, error);
      return fallbackValue;
    }
  };
};