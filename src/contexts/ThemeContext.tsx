// EMERGENCY SAFE REPLACEMENT - NO HOOKS USED
// This file replaces the problematic cached version

import React from 'react';

// Safe ThemeProvider that doesn't crash
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('🟢 SAFE ThemeProvider loaded - no hooks used');
  
  // Use createElement directly - no hooks
  return React.createElement('div', {
    'data-theme': 'light',
    style: { minHeight: '100vh' }
  }, children);
};

// Safe hook replacement
export const useTheme = () => {
  console.log('🟢 SAFE useTheme called');
  return {
    theme: 'light',
    setTheme: () => {},
    isDark: false
  };
};

export default ThemeProvider;