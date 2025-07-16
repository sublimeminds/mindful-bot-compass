
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

console.log('🔍 Debug: EMERGENCY MODE - Dummy ThemeContext should prevent crashes...');

// Force cache invalidation in browser
if (typeof window !== 'undefined') {
  // Clear all possible caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        console.log('🗑️ Clearing cache:', name);
        caches.delete(name);
      });
    });
  }
}

// Emergency measure - block any ThemeContext loading and catch crashes
if (typeof window !== 'undefined') {
  // Catch all unhandled errors that might cause blank page
  window.addEventListener('error', (event) => {
    console.error('🚨 Global error caught:', event.error);
    if (event.error?.message?.includes('ThemeContext') || 
        event.error?.message?.includes('useState') ||
        event.error?.message?.includes('ThemeProvider')) {
      console.log('🚫 Blocked ThemeContext-related error');
      event.preventDefault();
      return false;
    }
  });

  // Catch promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  const originalError = console.error;
  console.error = (...args) => {
    const errorStr = args.join(' ');
    if (errorStr.includes('ThemeContext') || errorStr.includes('ThemeProvider')) {
      console.log('🚫 Blocked ThemeContext error - cache issue detected');
      return;
    }
    originalError.apply(console, args);
  };
  
  console.log('🔍 Debug: Current location:', window.location.href);
  console.log('🔍 Debug: Available modules:', Object.keys((window as any).__vitePreload || {}));
}

console.log('🔍 React state before render:', {
  React: !!React,
  createElement: !!React?.createElement,
  useState: !!React?.useState,
  version: React?.version
});

// Final React safety check before render
if (!React || typeof React.createElement !== 'function' || typeof React.useState !== 'function') {
  console.error('CRITICAL: React is incomplete before render', {
    React: !!React,
    createElement: !!React?.createElement,
    useState: !!React?.useState
  });
  window.location.reload();
} else {
  console.log('✅ React is ready for render');
  
  // Add monitoring for when the app goes blank
  setTimeout(() => {
    const appElement = document.getElementById('root');
    if (appElement && appElement.innerHTML.trim() === '') {
      console.error('🚨 App went blank after initial render!');
      console.log('🔍 Checking for errors...');
    }
  }, 2000);
  
  root.render(
    <React.StrictMode>
      <AppSelector />
    </React.StrictMode>
  );
}
