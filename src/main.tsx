
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AvatarManagerProvider } from './components/avatar/OptimizedAvatarManager';
import { initializeLovableTagger } from './utils/lovableTaggerFix';
import { logLovableTaggerStatus } from './utils/debugLovableTagger';

// Enhanced lovable-tagger initialization with comprehensive error protection
const initSuccess = initializeLovableTagger();
console.log('🚀 Lovable-tagger initialization result:', initSuccess);

// Additional safety check for critical rendering
if (!initSuccess) {
  console.warn('⚠️  Lovable-tagger failed to initialize, applying emergency fallback');
  try {
    if (typeof window !== 'undefined') {
      (window as any).lov = { 
        tagger: {}, 
        config: {}, 
        utils: {}, 
        initialized: true, 
        emergency: true 
      };
    }
  } catch (emergencyError) {
    console.error('💥 Emergency fallback failed:', emergencyError);
  }
}

// Debug logging in development with enhanced monitoring
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    logLovableTaggerStatus();
    // Additional check for runtime errors
    if (window.lov) {
      console.log('🔍 Final window.lov state:', {
        preInitialized: window.lov.preInitialized,
        runtimeInitialized: window.lov.runtimeInitialized,
        initialized: window.lov.initialized,
        timestamp: window.lov.timestamp,
        runtimeTimestamp: window.lov.runtimeTimestamp
      });
    }
  }, 1000);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AvatarManagerProvider maxActiveAvatars={2}>
      <App />
    </AvatarManagerProvider>
  </React.StrictMode>
);
