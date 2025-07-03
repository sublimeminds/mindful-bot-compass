
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CSSProtection } from './utils/cssProtection';
import { serviceHealthManager } from './utils/serviceHealthManager';

// Initialize CSS protection before anything else
CSSProtection.init();

// Register services with health monitoring
serviceHealthManager.registerService({
  name: 'performanceService',
  loader: async () => {
    const module = await import('./services/performanceService');
    return module.performanceService;
  },
  required: false,
  timeout: 3000,
  retryAttempts: 2
});

serviceHealthManager.registerService({
  name: 'rateLimitService', 
  loader: async () => {
    const module = await import('./services/rateLimitService');
    return module.rateLimitService;
  },
  required: false,
  timeout: 2000,
  retryAttempts: 1
});

// Safe i18n initialization with better error handling
serviceHealthManager.registerService({
  name: 'i18n',
  loader: async () => {
    const module = await import('./i18n');
    return module;
  },
  required: false,
  timeout: 2000,
  retryAttempts: 1
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Start health monitoring
serviceHealthManager.startHealthChecks();

// Initialize services after a short delay to not block initial render
setTimeout(() => {
  // Safe service initialization with health manager
  const performanceService = serviceHealthManager.getService('performanceService');
  if (performanceService) {
    try {
      performanceService.startPerformanceMonitoring?.();
      performanceService.monitorMemoryUsage?.();
      performanceService.recordMetric?.('AppStartup', performance.now());
    } catch (error) {
      console.warn('Performance service initialization failed:', error);
    }
  }
  
  const rateLimitService = serviceHealthManager.getService('rateLimitService');
  if (rateLimitService) {
    try {
      rateLimitService.startCleanup?.();
    } catch (error) {
      console.warn('Rate limit service initialization failed:', error);
    }
  }

  // Log service health summary
  const healthSummary = serviceHealthManager.getHealthSummary();
  console.log('Services initialized. Health summary:', healthSummary);
}, 100);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
