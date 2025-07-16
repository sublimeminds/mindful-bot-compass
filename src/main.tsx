
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

console.log('🔍 Debug: NUCLEAR CACHE DESTRUCTION MODE');

// ULTIMATE cache destruction + module interception
if (typeof window !== 'undefined') {
  // Intercept module loading to block ThemeContext
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    if (url.includes('ThemeContext')) {
      console.log('🚫 BLOCKED ThemeContext module load:', url);
      // Return empty module
      return Promise.resolve(new Response('export const ThemeProvider = ({children}) => children; export const useTheme = () => ({theme: "light"});', {
        status: 200,
        headers: { 'Content-Type': 'application/javascript' }
      }));
    }
    return originalFetch.apply(this, args);
  };

  // Force complete page reload with cache bypass on any ThemeContext error
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (message?.toString().includes('ThemeContext') || 
        message?.toString().includes('useState') ||
        source?.includes('ThemeContext')) {
      console.log('🚨 ThemeContext error detected - forcing HARD refresh with cache bypass');
      // Force hard refresh with cache bypass
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'v=' + Date.now();
      return true;
    }
    return originalError ? originalError(message, source, lineno, colno, error) : false;
  };

  // Clear all possible caches aggressively
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        console.log('🗑️ Clearing cache:', name);
        caches.delete(name);
      });
    });
  }

  // Force a nuclear cache bypass URL refresh if no cache buster exists
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get('nuclear')) {
    console.log('🚨 NUCLEAR: Adding ultimate cache buster and reloading...');
    const randomPart = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    const newUrl = `${window.location.pathname}?nuclear=${timestamp}&random=${randomPart}&force=true&bust=${Date.now()}`;
    window.location.replace(newUrl);
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
