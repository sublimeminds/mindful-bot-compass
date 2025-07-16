
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Add safety checks for React availability
  try {
    if (typeof React === 'undefined' || !React || typeof React.useState !== 'function') {
      console.warn('ThemeProvider: React not ready, returning fallback');
      return <div className="min-h-screen bg-slate-900">{children}</div>;
    }
    
    // Simple theme provider without hooks to avoid React hook errors
    return (
      <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, isDark: false }}>
        {children}
      </ThemeContext.Provider>
    );
  } catch (error) {
    console.error('ThemeProvider error:', error);
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
