
import React from 'react';
import ReactDOM from 'react-dom/client';

// Essential bulletproof React check BEFORE anything else
if (!React || typeof React.createElement !== 'function') {
  console.error('CRITICAL: React is not properly loaded');
  window.location.reload();
}

import AppSelector from './AppSelector.tsx';
import './index.css';

// Import the safeguard AFTER React is confirmed to be working
import '@/utils/lovableTaggerSafeGuard';

// Minimal lovable-tagger initialization
const initializeLovableTagger = () => {
  try {
    if (typeof window !== 'undefined') {
      const lovableTagger = (window as any).lovableTagger;
      if (lovableTagger && typeof lovableTagger.init === 'function') {
        lovableTagger.init();
        console.log('✅ Main: Lovable-tagger initialized');
      }
      
      if (!(window as any).lov) {
        (window as any).lov = {
          initialized: false,
          tagger: null,
          config: null,
          utils: null
        };
      }
    }
  } catch (error) {
    console.error('❌ Main: Lovable-tagger init failed:', error);
    if (typeof window !== 'undefined' && !(window as any).lov) {
      (window as any).lov = {
        initialized: false,
        tagger: null,
        config: null,
        utils: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize lovable-tagger BEFORE rendering
initializeLovableTagger();

// Final React safety check before render
if (!React || typeof React.createElement !== 'function') {
  console.error('CRITICAL: React became null before render');
  window.location.reload();
} else {
  root.render(
    <React.StrictMode>
      <AppSelector />
    </React.StrictMode>
  );
}
