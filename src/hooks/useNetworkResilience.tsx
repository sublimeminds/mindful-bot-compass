
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
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    effectiveType: null,
    isSlowConnection: false,
    retryCount: 0
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };

    // Simple network detection without complex dependencies
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Try to detect connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkState(prev => ({
          ...prev,
          effectiveType: connection.effectiveType || '4g',
          isSlowConnection: connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'
        }));
      }
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
    
    throw lastError!;
  }, []);

  return { networkState, withRetry };
};
