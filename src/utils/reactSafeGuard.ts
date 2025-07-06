import React from 'react';

// React Safety Guard - Prevents components from rendering when React isn't ready
export const isReactReady = (): boolean => {
  try {
    // Check if React is available and properly initialized
    if (typeof React === 'undefined') return false;
    if (!React.useState) return false;
    if (!React.useEffect) return false;
    if (!React.createContext) return false;
    
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

// Hook to check React readiness
export const useReactReadiness = () => {
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
};