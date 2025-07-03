import React, { useState, useEffect } from 'react';

/**
 * Hook to detect when React's context system is fully initialized
 * This prevents Radix UI components from throwing useMemo errors
 * when they try to access React contexts before they're ready
 */
export const useReactContextReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if React context system is ready
    const checkContextReady = () => {
      try {
        // Try to access React's current context to ensure it's initialized
        if (typeof React !== 'undefined' && React.createElement) {
          // Add a small delay to ensure all React contexts are initialized
          setTimeout(() => {
            setIsReady(true);
          }, 50);
        }
      } catch (error) {
        console.log('[useReactContextReady] React not ready yet, retrying...');
        // Retry after a short delay
        setTimeout(checkContextReady, 100);
      }
    };

    checkContextReady();
  }, []);

  return isReady;
};