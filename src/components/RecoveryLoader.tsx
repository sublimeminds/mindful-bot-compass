import React, { useState, useEffect } from 'react';
import { appRecoveryManager } from '@/utils/appRecoveryManager';

/**
 * Recovery Loader - Handles progressive loading with recovery mechanisms
 */
const RecoveryLoader: React.FC = () => {
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryLevel, setRecoveryLevel] = useState<string>('full');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadApp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await appRecoveryManager.attemptRecovery();
        
        if (mounted) {
          setAppComponent(() => result.component);
          setRecoveryLevel(result.level);
          setLoading(false);
          
          console.log(`RecoveryLoader: Loaded app at level: ${result.level}`);
        }
      } catch (err) {
        console.error('RecoveryLoader: Complete failure:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    loadApp();

    // Listen to recovery state changes
    const unsubscribe = appRecoveryManager.onStateChange((state) => {
      if (mounted) {
        setRecoveryLevel(state.level);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleSmartRetry = async () => {
    setLoading(true);
    try {
      const result = await appRecoveryManager.smartRetry();
      setAppComponent(() => result.component);
      setRecoveryLevel(result.level);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForceRestart = () => {
    appRecoveryManager.forceRestart();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <h2 className="css-safe-heading">Loading TherapySync</h2>
          <p className="css-safe-text">Attempting recovery level: {recoveryLevel}</p>
        </div>
      </div>
    );
  }

  // Show complete failure
  if (error || !AppComponent) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <h2 className="css-safe-heading" style={{ color: '#dc3545' }}>
            ⚠️ Recovery Failed
          </h2>
          <p className="css-safe-text" style={{ marginBottom: '20px' }}>
            {error || 'Unable to load any version of the application'}
          </p>
          
          <div className="css-safe-flex" style={{ gap: '12px', justifyContent: 'center' }}>
            <button className="css-safe-button" onClick={handleSmartRetry}>
              🔧 Smart Retry
            </button>
            <button className="css-safe-button" onClick={handleForceRestart}>
              🔄 Force Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the loaded component
  return <AppComponent />;
};

export default RecoveryLoader;