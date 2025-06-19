
import { useState, useEffect, useCallback } from 'react';

interface NetworkState {
  isOnline: boolean;
  effectiveType: string | null;
  isSlowConnection: boolean;
  retryCount: number;
}

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
}

export const useNetworkResilience = () => {
  // Initialize with safe defaults
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: '4g',
    isSlowConnection: false,
    retryCount: 0
  });

  useEffect(() => {
    // Only run if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const updateOnlineStatus = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Try to detect connection type safely
    try {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && connection.effectiveType) {
          setNetworkState(prev => ({
            ...prev,
            effectiveType: connection.effectiveType || '4g',
            isSlowConnection: connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'
          }));
        }
      }
    } catch (error) {
      // Silently fail if connection API is not available
      console.warn('Network connection API not available');
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const withRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const { maxAttempts = 3, baseDelay = 1000 } = options;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setNetworkState(prev => ({ ...prev, retryCount: attempt - 1 }));
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          break;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    setNetworkState(prev => ({ ...prev, retryCount: 0 }));
    throw lastError!;
  }, []);

  return { networkState, withRetry };
};
