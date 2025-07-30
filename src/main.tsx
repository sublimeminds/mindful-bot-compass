
import * as React from 'react';
import ReactDOM from 'react-dom/client';

// === SIMPLIFIED React Safety Check ===
const verifyReactModules = () => {
  // Basic React availability check only
  return (
    typeof React !== 'undefined' && 
    React && 
    typeof React.createElement === 'function' && 
    typeof React.useState === 'function'
  );
};

// Single-pass React verification
if (!verifyReactModules()) {
  console.error('React not available, reloading page...');
  window.location.reload();
}

import AppSelector from './AppSelector.tsx';
import './index.css';
import './tests/autoTestRunner'; // Initialize auto test runner

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

console.log('🔍 Debug: Main loading with clean React state');

// Clean error handling without theme-specific interception
if (typeof window !== 'undefined') {
  // Force browser cache clearing for stale modules
  const clearBrowserCache = () => {
    try {
      // Clear service worker cache if present
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister());
        });
      }
      
      // Clear any cached theme data
      try {
        localStorage.removeItem('bulletproof-theme');
        sessionStorage.clear();
      } catch (e) {
        // Ignore storage errors
      }
      
      // Add cache-busting to module loading
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/src/utils/BulletproofTheme.tsx?v=${Date.now()}`;
      document.head.appendChild(link);
      
    } catch (error) {
      console.warn('Cache clearing warning:', error);
    }
  };

  clearBrowserCache();

  // Simple error boundary for unhandled errors
  window.addEventListener('error', (event) => {
    console.error('🚨 Global error caught:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
  });
}

console.log('🔍 React state before render:', {
  React: !!React,
  createElement: !!React?.createElement,
  useState: !!React?.useState,
  version: React?.version
});

// Final comprehensive React safety check before render
const finalReactCheck = () => {
  const issues = [];
  
  if (!React) issues.push('React object missing');
  if (typeof React.createElement !== 'function') issues.push('createElement missing');
  if (typeof React.useState !== 'function') issues.push('useState missing');
  if (typeof React.useEffect !== 'function') issues.push('useEffect missing');
  
  if (issues.length > 0) {
    console.error('CRITICAL: React incomplete before render:', issues);
    window.location.reload();
    return false;
  }
  
  return true;
};

if (finalReactCheck()) {
  console.log('✅ React is ready for render - all checks passed');
  
  // Render with additional error boundary protection
  try {
    root.render(<AppSelector />);
    console.log('✅ Application rendered successfully');
  } catch (renderError) {
    console.error('🚨 Render error:', renderError);
    setTimeout(() => window.location.reload(), 100);
  }
} else {
  console.error('❌ Final React check failed');
}
