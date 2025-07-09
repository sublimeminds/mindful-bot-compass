import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { LovableTaggerInitializer } from '@/utils/lovable-tagger-init';

interface BulletproofLovableWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
  retries?: number;
  onError?: (error: Error) => void;
  onRecovery?: () => void;
}

/**
 * PHASE 3: Bulletproof wrapper that ensures lovable-tagger is ready before rendering
 * Includes multiple safety layers and automatic recovery
 */
const BulletproofLovableWrapper: React.FC<BulletproofLovableWrapperProps> = ({ 
  children, 
  fallback = <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div></div>,
  timeout = 10000,
  retries = 3,
  onError,
  onRecovery
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkLovableHealth = async () => {
    try {
      // Wait for initialization
      await LovableTaggerInitializer.initialize();
      
      // Verify health
      if (LovableTaggerInitializer.isHealthy()) {
        setIsReady(true);
        setError(null);
        onRecovery?.();
        
        // Clear intervals
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        console.log('✅ BulletproofLovableWrapper ready');
        return true;
      }
      
      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown lovable-tagger error');
      console.error('BulletproofLovableWrapper health check failed:', error);
      return false;
    }
  };

  const attemptRecovery = async () => {
    if (retryCount >= retries) {
      const finalError = new Error(`Lovable-tagger failed after ${retries} recovery attempts`);
      setError(finalError);
      onError?.(finalError);
      return;
    }

    console.log(`🔧 Attempting lovable-tagger recovery (${retryCount + 1}/${retries})`);
    setRetryCount(prev => prev + 1);
    
    // Force recovery
    LovableTaggerInitializer.forceRecovery();
    
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if recovery was successful
    const isHealthy = await checkLovableHealth();
    if (!isHealthy) {
      // Schedule another recovery attempt
      setTimeout(attemptRecovery, 2000);
    }
  };

  useEffect(() => {
    const initializeLovable = async () => {
      // Initial health check
      const isHealthy = await checkLovableHealth();
      
      if (!isHealthy) {
        // Set up monitoring interval
        intervalRef.current = setInterval(async () => {
          const healthy = await checkLovableHealth();
          if (!healthy && retryCount < retries) {
            attemptRecovery();
          }
        }, 500);

        // Set up timeout for complete failure
        timeoutRef.current = setTimeout(() => {
          if (!isReady) {
            const timeoutError = new Error(`Lovable-tagger initialization timeout after ${timeout}ms`);
            setError(timeoutError);
            onError?.(timeoutError);
          }
        }, timeout);
      }
    };

    initializeLovable();

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeout, retries, onError, onRecovery, retryCount]);

  // Error state with retry option
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm font-medium">Component Loading Error</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {error.message}
        </p>
        <button 
          onClick={() => {
            setError(null);
            setRetryCount(0);
            setIsReady(false);
            checkLovableHealth();
          }}
          className="px-4 py-2 bg-therapy-500 text-white rounded-lg text-sm hover:bg-therapy-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (!isReady) {
    return <>{fallback}</>;
  }

  // Ready state - render children
  return <>{children}</>;
};

export default BulletproofLovableWrapper;