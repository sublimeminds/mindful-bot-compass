
import { useState, useEffect } from 'react';

interface NetworkState {
  isOnline: boolean;
  effectiveType: string | null;
  isSlowConnection: boolean;
  retryCount: number;
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

  return { networkState };
};
