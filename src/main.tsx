
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CSSProtection } from './utils/cssProtection';

// Initialize CSS protection before anything else
CSSProtection.init();

// Safe service imports with error handling
let performanceService: any = null;
let rateLimitService: any = null;

try {
  performanceService = require('./services/performanceService').performanceService;
  rateLimitService = require('./services/rateLimitService').rateLimitService;
} catch (error) {
  console.warn('Services failed to load, continuing without them:', error);
}

// Safe i18n initialization
try {
  require('./i18n');
} catch (error) {
  console.warn('i18n failed to load, continuing without translations:', error);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Safe service initialization
try {
  if (performanceService) {
    performanceService.startPerformanceMonitoring();
    performanceService.monitorMemoryUsage();
    performanceService.recordMetric('AppStartup', performance.now());
  }
  if (rateLimitService) {
    rateLimitService.startCleanup();
  }
} catch (error) {
  console.warn('Service initialization failed, continuing without monitoring:', error);
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
