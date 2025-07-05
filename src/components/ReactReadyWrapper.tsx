
import React, { useState, useEffect } from 'react';

interface ReactReadyWrapperProps {
  children: React.ReactNode;
}

const ReactReadyWrapper: React.FC<ReactReadyWrapperProps> = ({ children }) => {
  // Use a simple state to track readiness without hooks initially
  const [isReactReady, setIsReactReady] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const checkReactReadiness = () => {
      try {
        // Comprehensive React validation
        if (
          typeof React !== 'undefined' &&
          React !== null &&
          React.useState &&
          React.useEffect &&
          React.useContext &&
          React.createElement &&
          typeof React.useState === 'function' &&
          typeof React.useEffect === 'function' &&
          typeof React.useContext === 'function' &&
          typeof React.createElement === 'function'
        ) {
          if (mounted) {
            console.log('ReactReadyWrapper: React is fully ready');
            setIsReactReady(true);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('ReactReadyWrapper: Error checking React readiness:', error);
        return false;
      }
    };

    // Initial check
    if (checkReactReadiness()) {
      return;
    }

    // Retry mechanism with exponential backoff
    const maxAttempts = 10;
    let attempts = 0;
    
    const retryCheck = () => {
      attempts++;
      setInitializationAttempts(attempts);
      
      if (checkReactReadiness()) {
        return;
      }
      
      if (attempts < maxAttempts && mounted) {
        const delay = Math.min(100 * Math.pow(2, attempts), 2000);
        console.log(`ReactReadyWrapper: Retrying React check (attempt ${attempts}/${maxAttempts}) in ${delay}ms`);
        setTimeout(retryCheck, delay);
      } else if (mounted) {
        console.error('ReactReadyWrapper: Failed to initialize React after maximum attempts');
        // Force set ready to prevent infinite loading
        setIsReactReady(true);
      }
    };

    // Start retry mechanism
    setTimeout(retryCheck, 50);

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReactReady) {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }
    }, React.createElement('div', {
      style: {
        padding: '20px',
        textAlign: 'center'
      }
    }, [
      React.createElement('div', { key: 'spinner', style: { marginBottom: '16px' } }, 'Loading...'),
      initializationAttempts > 0 && React.createElement('div', {
        key: 'attempts',
        style: {
          fontSize: '12px',
          color: '#666',
          marginTop: '8px'
        }
      }, `Initialization attempt: ${initializationAttempts}`)
    ]));
  }

  return React.createElement(React.Fragment, {}, children);
};

export default ReactReadyWrapper;
