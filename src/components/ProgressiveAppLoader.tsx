import React, { useState, useEffect } from 'react';
import SafeErrorBoundary from './SafeErrorBoundary';

interface ProgressiveAppProps {
  children: React.ReactNode;
}

/**
 * Progressive App Loader
 * Loads features incrementally to prevent initialization failures
 */
const ProgressiveAppLoader: React.FC<ProgressiveAppProps> = ({ children }) => {
  const [loadingStage, setLoadingStage] = useState<'core' | 'services' | 'complete'>('core');
  const [failedStages, setFailedStages] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    
    const loadProgressively = async () => {
      try {
        // Stage 1: Core app (minimal functionality)
        console.log('Progressive Loading: Core stage');
        await new Promise(resolve => setTimeout(resolve, 100)); // Allow core to settle
        
        if (!mounted) return;
        
        // Stage 2: Services (non-critical)
        console.log('Progressive Loading: Services stage');
        setLoadingStage('services');
        
        try {
          // Attempt to load services with timeout
          await Promise.race([
            loadServices(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Services timeout')), 3000)
            )
          ]);
        } catch (error) {
          console.warn('Progressive Loading: Services failed, continuing without them', error);
          setFailedStages(prev => [...prev, 'services']);
        }
        
        if (!mounted) return;
        
        // Stage 3: Complete
        console.log('Progressive Loading: Complete');
        setLoadingStage('complete');
        
      } catch (error) {
        console.error('Progressive Loading: Critical failure', error);
        setFailedStages(prev => [...prev, 'core']);
      }
    };

    loadProgressively();

    return () => {
      mounted = false;
    };
  }, []);

  const loadServices = async () => {
    // Simulate service loading - replace with actual service loading
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'core':
        return 'Loading core application...';
      case 'services':
        return 'Loading services...';
      case 'complete':
        return null;
      default:
        return 'Initializing...';
    }
  };

  const loadingMessage = getLoadingMessage();

  if (loadingMessage) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <div className="css-safe-text">{loadingMessage}</div>
          {failedStages.length > 0 && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px', 
              backgroundColor: '#fef3cd', 
              borderRadius: '4px',
              fontSize: '12px',
              color: '#856404'
            }}>
              Some features may be limited (failed: {failedStages.join(', ')})
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <SafeErrorBoundary name="ProgressiveApp">
      {children}
    </SafeErrorBoundary>
  );
};

export default ProgressiveAppLoader;