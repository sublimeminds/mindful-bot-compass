
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the safeguard BEFORE any other initialization
import '@/utils/lovableTaggerSafeGuard';

// Enhanced lovable-tagger initialization with bulletproof protection
const initializeLovableTagger = () => {
  try {
    console.log('🚀 Main: Starting enhanced lovable-tagger initialization');
    
    // The safeguard has already ensured window.lov exists
    if (typeof window !== 'undefined') {
      // Try to initialize lovable-tagger if available
      const lovableTagger = (window as any).lovableTagger;
      if (lovableTagger && typeof lovableTagger.init === 'function') {
        lovableTagger.init();
        if ((window as any).lov) {
          (window as any).lov.initialized = true;
        }
        console.log('✅ Main: Lovable-tagger initialized successfully');
      } else {
        console.log('ℹ️ Main: Lovable-tagger not available, continuing with safeguard protection');
      }
      
      // Final safety check
      if (!(window as any).lov) {
        console.warn('🚨 Main: Creating emergency lov object');
        (window as any).lov = {
          initialized: false,
          tagger: null,
          config: null,
          utils: null,
          emergencyFallback: true
        };
      }
    }
  } catch (error) {
    console.error('❌ Main: Lovable-tagger initialization failed:', error);
    
    // Emergency fallback
    if (typeof window !== 'undefined' && !(window as any).lov) {
      (window as any).lov = {
        initialized: false,
        tagger: null,
        config: null,
        utils: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        emergencyFallback: true
      };
    }
  }
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize lovable-tagger before rendering
initializeLovableTagger();

// Simple render with lovable-tagger protection
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
