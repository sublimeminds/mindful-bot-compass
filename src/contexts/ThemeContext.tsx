// Emergency ThemeContext stub to prevent import errors - NO REACT HOOKS
import React from 'react';

console.log('⚠️ STUB: ThemeContext stub loaded to prevent import errors');

// Minimal stub that redirects to BulletproofTheme - NO HOOKS ALLOWED
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('⚠️ STUB: Using ThemeContext stub - pure passthrough (no hooks)');
  
  // NO React.useEffect - causes hook errors!
  // Just return children directly
  return React.createElement(React.Fragment, null, children);
};

export const useTheme = () => {
  console.log('⚠️ STUB: useTheme stub called - using fallback values (no hooks)');
  
  return {
    theme: 'light' as const,
    setTheme: () => console.log('⚠️ STUB: setTheme called'),
    isDark: false
  };
};

export default ThemeProvider;