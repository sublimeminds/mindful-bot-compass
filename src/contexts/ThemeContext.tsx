
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Static theme value to avoid any hook usage
const STATIC_THEME_VALUE: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  isDark: false
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Completely avoid any React hooks or complex logic
  // Use only static React.createElement to prevent hook errors
  
  try {
    // Check if we can safely create React elements
    if (typeof React?.createElement !== 'function') {
      console.warn('ThemeProvider: React.createElement not available');
      return React.createElement('div', {
        className: 'min-h-screen bg-slate-900',
        style: { backgroundColor: '#0f172a', minHeight: '100vh' }
      }, children);
    }

    return React.createElement(
      ThemeContext.Provider,
      { value: STATIC_THEME_VALUE },
      children
    );
  } catch (error) {
    console.error('ThemeProvider error:', error);
    // Return a plain div as absolute fallback
    return React.createElement('div', {
      className: 'min-h-screen bg-slate-900',
      style: { backgroundColor: '#0f172a', minHeight: '100vh' }
    }, children);
  }
};

export const useTheme = () => {
  try {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      // Return static theme instead of throwing
      return STATIC_THEME_VALUE;
    }
    return context;
  } catch (error) {
    console.warn('useTheme hook error, returning static theme:', error);
    return STATIC_THEME_VALUE;
  }
};
