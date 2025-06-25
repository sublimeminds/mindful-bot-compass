
import React from 'react';

interface ReactSafetyResult {
  isReactSafe: boolean;
  error?: string;
}

export const checkReactSafety = (): ReactSafetyResult => {
  try {
    if (typeof React === 'undefined' || React === null) {
      return { isReactSafe: false, error: 'React is not available' };
    }

    if (typeof React.useState !== 'function') {
      return { isReactSafe: false, error: 'React.useState is not available' };
    }

    if (typeof React.useEffect !== 'function') {
      return { isReactSafe: false, error: 'React.useEffect is not available' };
    }

    if (typeof React.useContext !== 'function') {
      return { isReactSafe: false, error: 'React.useContext is not available' };
    }

    return { isReactSafe: true };
  } catch (error) {
    return { 
      isReactSafe: false, 
      error: `React safety check failed: ${(error as Error).message}` 
    };
  }
};

export const withReactSafetyCheck = <T extends (...args: any[]) => any>(
  component: T,
  fallback?: React.ComponentType<any>
): T => {
  const SafeComponent = (props: any) => {
    const safety = checkReactSafety();
    
    if (!safety.isReactSafe) {
      console.error('React safety check failed:', safety.error);
      
      if (fallback) {
        return React.createElement(fallback, props);
      }
      
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          textAlign: 'center'
        }
      }, `React Error: ${safety.error}`);
    }
    
    return React.createElement(component, props);
  };
  
  return SafeComponent as T;
};
