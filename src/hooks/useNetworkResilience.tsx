
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
}

interface NetworkState {
  isOnline: boolean;
  effectiveType: string | null;
  isSlowConnection: boolean;
  retryCount: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  jitter: true
};

export const useNetworkResilience = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    effectiveType: null,
    isSlowConnection: false,
    retryCount: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    const updateOnlineStatus = () => {
      setNetworkState(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        const isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType);
        setNetworkState(prev => ({
          ...prev,
          effectiveType: connection.effectiveType,
          isSlowConnection
        }));
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  const calculateDelay = useCallback((attempt: number, config: RetryConfig): number => {
    let delay = Math.min(
      config.baseDelay * Math.pow(config.backoffFactor, attempt),
      config.maxDelay
    );

    if (config.jitter) {
      delay += Math.random() * 1000;
    }

    if (networkState.isSlowConnection) {
      delay *= 1.5;
    }

    return delay;
  }, [networkState.isSlowConnection]);

  const withRetry = useCallback(async (
    operation: () => Promise<any>,
    config: Partial<RetryConfig> = {}
  ): Promise<any> => {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;
    
    for (let attempt = 0; attempt < finalConfig.maxAttempts; attempt++) {
      try {
        setNetworkState(prev => ({ ...prev, retryCount: attempt }));
        
        if (!networkState.isOnline) {
          throw new Error('Network unavailable');
        }
        
        const result = await operation();
        
        if (attempt > 0) {
          setNetworkState(prev => ({ ...prev, retryCount: 0 }));
          toast({
            title: "Connection Restored",
            description: "Successfully reconnected after network issues.",
            variant: "default"
          });
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('unauthorized') || 
              errorMessage.includes('forbidden') ||
              errorMessage.includes('not found')) {
            throw error;
          }
        }
        
        if (attempt === finalConfig.maxAttempts - 1) {
          setNetworkState(prev => ({ ...prev, retryCount: 0 }));
          
          if (!networkState.isOnline) {
            toast({
              title: "Offline",
              description: "You're currently offline. Changes will sync when connection is restored.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Network Error",
              description: `Failed after ${finalConfig.maxAttempts} attempts. Please try again.`,
              variant: "destructive"
            });
          }
          
          throw lastError;
        }
        
        const delay = calculateDelay(attempt, finalConfig);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Retrying operation (attempt ${attempt + 2}/${finalConfig.maxAttempts}) after ${delay}ms`);
      }
    }
    
    throw lastError!;
  }, [networkState, calculateDelay, toast]);

  const withCircuitBreaker = useCallback((
    operation: () => Promise<any>,
    key: string,
    threshold: number = 5
  ): Promise<any> => {
    const failures = parseInt(localStorage.getItem(`cb_failures_${key}`) || '0');
    const lastFailureTime = parseInt(localStorage.getItem(`cb_last_failure_${key}`) || '0');
    const circuitOpenTime = 30000;

    if (failures >= threshold) {
      const timeSinceLastFailure = Date.now() - lastFailureTime;
      if (timeSinceLastFailure < circuitOpenTime) {
        return Promise.reject(new Error(`Circuit breaker open for ${key}. Try again later.`));
      } else {
        localStorage.removeItem(`cb_failures_${key}`);
        localStorage.removeItem(`cb_last_failure_${key}`);
      }
    }

    return operation().catch(error => {
      const newFailures = failures + 1;
      localStorage.setItem(`cb_failures_${key}`, newFailures.toString());
      localStorage.setItem(`cb_last_failure_${key}`, Date.now().toString());
      
      if (newFailures >= threshold) {
        toast({
          title: "Service Temporarily Unavailable",
          description: `${key} service is experiencing issues. Please try again in a few minutes.`,
          variant: "destructive"
        });
      }
      
      throw error;
    });
  }, [toast]);

  return {
    networkState,
    withRetry,
    withCircuitBreaker,
    isOnline: networkState.isOnline,
    isSlowConnection: networkState.isSlowConnection
  };
};
