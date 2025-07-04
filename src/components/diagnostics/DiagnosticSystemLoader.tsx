import React, { useState, useEffect } from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

// Lazy load diagnostic components to avoid startup conflicts
const ReactHealthMonitor = React.lazy(() => import('./ReactHealthMonitor'));
const ReactHealthDashboard = React.lazy(() => import('./ReactHealthDashboard'));
const ErrorReportingSystem = React.lazy(() => import('./ErrorReportingSystem'));

interface DiagnosticSystemState {
  isAppStable: boolean;
  loadedSystems: Set<string>;
  systemErrors: Record<string, string>;
}

const DiagnosticSystemLoader: React.FC = () => {
  const [state, setState] = useState<DiagnosticSystemState>({
    isAppStable: false,
    loadedSystems: new Set(),
    systemErrors: {}
  });

  useEffect(() => {
    // Wait for app to be stable before loading diagnostic systems
    const checkAppStability = async () => {
      // Give the main app time to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if React context is stable
      const validation = reactHookValidator.validateReactContext();
      if (validation.isValid) {
        console.log('DiagnosticSystemLoader: App is stable, loading diagnostic systems...');
        setState(prev => ({ ...prev, isAppStable: true }));
      }
    };

    checkAppStability();
  }, []);

  const loadSystem = (systemName: string, Component: React.ComponentType) => {
    if (state.loadedSystems.has(systemName)) {
      return <Component key={systemName} />;
    }

    return (
      <React.Suspense 
        key={systemName}
        fallback={null}
      >
        <Component />
      </React.Suspense>
    );
  };

  // Only render diagnostic systems if app is stable and in development
  if (!state.isAppStable || import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {loadSystem('ReactHealthMonitor', ReactHealthMonitor)}
      {loadSystem('ErrorReportingSystem', ErrorReportingSystem)}
      {loadSystem('ReactHealthDashboard', ReactHealthDashboard)}
    </>
  );
};

export default DiagnosticSystemLoader;