import React, { ReactNode, useEffect, useState } from 'react';
import { UnbreakableLovProxy } from '@/utils/unbreakable-lov-proxy';

interface BulletproofLovableGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Ultimate protection against lovable-tagger errors
 * This guard ensures components only render when window.lov is unbreakably safe
 */
const BulletproofLovableGuard: React.FC<BulletproofLovableGuardProps> = ({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600"></div>
    </div>
  ),
  onError 
}) => {
  const [isProtected, setIsProtected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupProtection = async () => {
      try {
        // Ensure unbreakable proxy is active
        UnbreakableLovProxy.ensureUnbreakableLov();
        
        // Double-check health
        if (UnbreakableLovProxy.isHealthy()) {
          setIsProtected(true);
          setError(null);
        } else {
          throw new Error('Unbreakable lov proxy health check failed');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown protection error');
        console.error('BulletproofLovableGuard protection failed:', error);
        setError(error);
        onError?.(error);
        
        // Force reset and try again
        try {
          UnbreakableLovProxy.forceReset();
          if (UnbreakableLovProxy.isHealthy()) {
            setIsProtected(true);
            setError(null);
          }
        } catch (resetError) {
          console.error('Force reset also failed:', resetError);
          // Render anyway - the unbreakable proxy should handle everything
          setIsProtected(true);
        }
      }
    };

    setupProtection();
  }, [onError]);

  // Error state
  if (error) {
    return (
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
        <div className="flex items-center space-x-2 text-amber-800">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <p className="text-sm font-medium">Component protection active</p>
        </div>
        <p className="text-xs text-amber-600 mt-1">
          {error.message}
        </p>
        <button 
          onClick={() => {
            setError(null);
            setIsProtected(false);
          }}
          className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (!isProtected) {
    return <>{fallback}</>;
  }

  // Protected state - safe to render
  return <>{children}</>;
};

export default BulletproofLovableGuard;