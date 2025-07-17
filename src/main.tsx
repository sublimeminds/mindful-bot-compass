
import * as React from 'react';
import ReactDOM from 'react-dom/client';

// === ENHANCED React Module Safety Check ===
const verifyReactModules = () => {
  console.log('🔍 SAFETY: Verifying React modules...');
  
  // Check React object existence and structure
  if (typeof React === 'undefined' || !React || typeof React !== 'object') {
    console.error('CRITICAL: React object is not available');
    return false;
  }

  // Check essential React methods
  const requiredMethods = ['createElement', 'Fragment', 'Component'];
  for (const method of requiredMethods) {
    if (!React[method] || typeof React[method] !== 'function') {
      console.error(`CRITICAL: React.${method} is not available`);
      return false;
    }
  }

  // Check React hooks with detailed verification
  const requiredHooks = ['useState', 'useEffect', 'useContext', 'useRef', 'useMemo'];
  for (const hook of requiredHooks) {
    if (!React[hook] || typeof React[hook] !== 'function') {
      console.error(`CRITICAL: React.${hook} is not available or not a function`);
      return false;
    }
  }

  console.log('✅ SAFETY: React modules verified successfully');
  return true;
};

// Clear any potentially cached modules that could cause conflicts
const clearStaleModules = () => {
  try {
    // Clear module cache keys that might interfere
    const moduleKeys = Object.keys(window).filter(key => 
      key.includes('theme') || key.includes('Theme') || key.includes('context')
    );
    moduleKeys.forEach(key => {
      try {
        delete (window as any)[key];
      } catch (e) {
        // Ignore deletion errors
      }
    });
  } catch (error) {
    console.warn('Module cleanup warning:', error);
  }
};

// Enhanced safety check with retry mechanism
let reactVerificationAttempts = 0;
const maxVerificationAttempts = 3;

const ensureReactSafety = () => {
  reactVerificationAttempts++;
  
  if (!verifyReactModules()) {
    if (reactVerificationAttempts < maxVerificationAttempts) {
      console.warn(`React verification failed, attempt ${reactVerificationAttempts}/${maxVerificationAttempts}. Clearing cache and retrying...`);
      clearStaleModules();
      setTimeout(ensureReactSafety, 100);
      return false;
    } else {
      console.error('CRITICAL: React verification failed after multiple attempts. Forcing page reload...');
      clearStaleModules();
      window.location.reload();
      throw new Error('React not available after multiple verification attempts');
    }
  }
  
  return true;
};

// Initial safety check with module clearing
clearStaleModules();
if (!ensureReactSafety()) {
  throw new Error('React safety check failed');
}

import AppSelector from './AppSelector.tsx';
import './index.css';

// Import module cleanup utility
import { clearDevelopmentCache } from '@/utils/moduleCleanup';
import { forceApplicationReload } from '@/utils/forceReload';

// Import the safeguard AFTER React is confirmed to be working
import '@/utils/lovableTaggerSafeGuard';

// Clear development cache to prevent stale modules
if (import.meta.env.DEV) {
  clearDevelopmentCache();
}

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

  // Enhanced error handling with force reload for ThemeContext errors
  window.addEventListener('error', (event) => {
    console.error('🚨 Global error caught:', event.error);
    if (event.error?.message?.includes('ThemeContext') || 
        event.error?.message?.includes('useState') ||
        event.filename?.includes('ThemeContext')) {
      console.error('🚨 Detected stale module reference - forcing reload');
      forceApplicationReload();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    if (event.reason?.message?.includes('ThemeContext')) {
      console.error('🚨 Detected stale module in promise - forcing reload');
      forceApplicationReload();
    }
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
    clearStaleModules();
    window.location.reload();
    return false;
  }
  
  return true;
};

if (finalReactCheck()) {
  console.log('✅ React is ready for render - all checks passed');
  
  // Render with additional error boundary protection
  try {
    root.render(
      <React.StrictMode>
        <AppSelector />
      </React.StrictMode>
    );
    console.log('✅ Application rendered successfully');
  } catch (renderError) {
    console.error('🚨 Render error:', renderError);
    clearStaleModules();
    setTimeout(() => window.location.reload(), 100);
  }
} else {
  console.error('❌ Final React check failed');
}
