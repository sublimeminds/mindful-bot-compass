
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Safety check for React availability
  if (!React || typeof React.createElement !== 'function') {
    console.warn('ThemeProvider: React not available, rendering children directly');
    return children as any;
  }
  
  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
