
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize lovable-tagger safely with enhanced error handling
const initializeLovableTagger = () => {
  try {
    // Ensure window.lov exists with safe fallback
    if (typeof window !== 'undefined') {
      (window as any).lov = {
        initialized: false,
        tagger: null,
        config: null,
        utils: null
      };
      
      // Try to initialize lovable-tagger if available
      const lovableTagger = (window as any).lovableTagger;
      if (lovableTagger && typeof lovableTagger.init === 'function') {
        lovableTagger.init();
        (window as any).lov.initialized = true;
        console.log('✅ Lovable-tagger initialized successfully');
      } else {
        console.log('ℹ️ Lovable-tagger not available, using safe fallback');
      }
    }
  } catch (error) {
    console.error('❌ Lovable-tagger initialization failed:', error);
    // Always ensure minimal lov object exists
    if (typeof window !== 'undefined') {
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

// Initialize lovable-tagger before rendering
initializeLovableTagger();

// Simple render with lovable-tagger protection
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
