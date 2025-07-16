// EMERGENCY DUMMY FILE - Prevents ThemeContext crashes
// This file exists only to replace the cached problematic version

import React from 'react';

// Create dummy components that don't use hooks to prevent crashes
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🚫 DUMMY ThemeProvider - cache replacement active');
  
  // Don't use any hooks - just return children wrapped in a div
  return React.createElement('div', {
    className: 'theme-provider-dummy',
    'data-theme': 'light'
  }, children);
};

// Export dummy hook that doesn't use React hooks
export const useTheme = () => {
  console.log('🚫 DUMMY useTheme - cache replacement active');
  return {
    theme: 'light' as const,
    setTheme: () => {
      console.log('🚫 DUMMY setTheme called');
    },
    isDark: false,
    toggleTheme: () => {
      console.log('🚫 DUMMY toggleTheme called');
    }
  };
};

// Export as default too in case it's imported differently
export default ThemeProvider;

console.log('🚫 DUMMY ThemeContext loaded - this should replace the cached version');