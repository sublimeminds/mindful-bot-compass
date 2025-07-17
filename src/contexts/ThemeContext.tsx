// Emergency fallback theme context - no React hooks
import React from 'react';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTheme = () => ({
  theme: 'light' as const,
  setTheme: () => {},
  isDark: false
});