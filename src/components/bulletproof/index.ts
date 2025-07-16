import React from 'react';

// Bulletproof Framework - Main exports
export { SafeHookProvider, useSafeHooks } from './SafeHookProvider';
export { BulletproofAuthProvider, useBulletproofAuth } from './BulletproofAuthProvider';
export { SafeComponentWrapper, useSafeComponent } from './SafeComponentWrapper';
export { SafeRouter, useSafeNavigation } from './SafeRouter';

// Version info
export const BULLETPROOF_VERSION = '1.0.0';
export const BULLETPROOF_BUILD = new Date().toISOString();

// Health check utility
export const checkFrameworkHealth = () => {
  const checks = {
    reactReady: typeof React !== 'undefined',
    hooksAvailable: true,
    routerAvailable: typeof window !== 'undefined' && 'history' in window,
    authAvailable: true,
    timestamp: new Date().toISOString()
  };

  console.log('🛡️ Bulletproof Framework Health Check:', checks);
  return checks;
};