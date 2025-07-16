// EMERGENCY THEME CONTEXT REPLACEMENT
// This file completely replaces the old ThemeContext with a bulletproof version

import React from 'react';
import { getTheme, setTheme, isDark } from '@/utils/BulletproofTheme';

type Theme = 'light' | 'dark';

// Simple theme context that uses the bulletproof theme manager
const themeValue: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
} = {
  theme: 'light',
  setTheme: () => {},
  isDark: false
};

// Update theme value from bulletproof manager
const updateThemeValue = () => {
  themeValue.theme = getTheme();
  themeValue.setTheme = setTheme;
  themeValue.isDark = isDark();
};

// Initialize immediately
updateThemeValue();

// Listen for theme changes and update
if (typeof window !== 'undefined') {
  window.addEventListener('theme-changed', updateThemeValue);
}

// ThemeProvider that uses bulletproof theme system
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the bulletproof theme manager directly
  React.useEffect(() => {
    updateThemeValue();
  }, []);

  return <>{children}</>;
};

// useTheme hook that returns current theme state
export const useTheme = () => {
  const [theme, setThemeState] = React.useState(getTheme());
  const [darkMode, setDarkMode] = React.useState(isDark());

  React.useEffect(() => {
    const updateState = () => {
      setThemeState(getTheme());
      setDarkMode(isDark());
    };

    updateState();
    window.addEventListener('theme-changed', updateState);
    
    return () => window.removeEventListener('theme-changed', updateState);
  }, []);

  return {
    theme,
    setTheme,
    isDark: darkMode
  };
};

export default { ThemeProvider, useTheme };