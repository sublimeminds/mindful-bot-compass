
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { performanceService } from './services/performanceService';
import { rateLimitService } from './services/rateLimitService';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize performance monitoring
performanceService.startPerformanceMonitoring();
performanceService.monitorMemoryUsage();
rateLimitService.startCleanup();

// Record app startup time
performanceService.recordMetric('AppStartup', performance.now());

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
