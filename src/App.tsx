import React, { useEffect } from 'react';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import RecoveryLoader from '@/components/RecoveryLoader';
import { selfHealingSystem } from '@/utils/selfHealingSystem';
import { dependencyManager } from '@/utils/dependencyManager';
import { serviceHealthManager } from '@/utils/serviceHealthManager';
import './App.css';

function App() {
  console.log('App: Starting TherapySync with Advanced Recovery System...');
  
  useEffect(() => {
    // Initialize recovery systems
    console.log('App: Initializing recovery systems...');
    
    // Start service health monitoring
    serviceHealthManager.startHealthChecks(5000);
    
    // Register core dependencies for monitoring
    dependencyManager.register({
      name: 'react',
      loader: async () => {
        const React = await import('react');
        return React;
      },
      required: true,
      timeout: 3000,
      retryAttempts: 2,
      healthCheck: async () => {
        try {
          const React = await import('react');
          return !!React.version;
        } catch {
          return false;
        }
      }
    });
    
    dependencyManager.register({
      name: 'router',
      loader: async () => {
        const { BrowserRouter } = await import('react-router-dom');
        return BrowserRouter;
      },
      required: true,
      timeout: 3000,
      retryAttempts: 2,
      healthCheck: async () => {
        try {
          const { BrowserRouter } = await import('react-router-dom');
          return !!BrowserRouter;
        } catch {
          return false;
        }
      }
    });
    
    // Load dependencies
    dependencyManager.loadAll().then((result) => {
      if (result.success) {
        console.log('App: Core dependencies loaded successfully');
      } else {
        console.warn('App: Some dependencies failed:', result.errors);
      }
    });
    
    // Self-healing system is auto-started
    console.log('App: Recovery systems initialized');
    
    return () => {
      // Cleanup on unmount
      serviceHealthManager.cleanup();
      selfHealingSystem.cleanup();
    };
  }, []);
  
  return (
    <BulletproofErrorBoundary>
      <RecoveryLoader />
    </BulletproofErrorBoundary>
  );
}

export default App;