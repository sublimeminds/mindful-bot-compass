
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Add React safety check before using hooks
  const [isReactSafe, setIsReactSafe] = useState(true);
  
  // Safe state initialization
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || 'system';
    } catch {
      return 'system';
    }
  });

  const [isDark, setIsDark] = useState(false);

  // Safer theme setter with validation
  const setTheme = useCallback((newTheme: Theme) => {
    if (!isReactSafe) {
      console.warn('ThemeProvider: React not safe, skipping theme update');
      return;
    }
    setThemeState(newTheme);
  }, [isReactSafe]);

  // Check React safety on mount
  useEffect(() => {
    const checkReactSafety = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const validation = reactHookValidator.validateReactContext();
      if (!validation.isValid) {
        console.warn('ThemeProvider: React hooks not safe, using fallback mode');
        setIsReactSafe(false);
      }
    };
    checkReactSafety();
  }, []);

  useEffect(() => {
    if (!isReactSafe) return;
    
    const root = window.document.documentElement;
    
    const updateTheme = () => {
      let shouldBeDark = false;
      
      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // system theme
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme, isReactSafe]);

  useEffect(() => {
    if (!isReactSafe) return;
    
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('ThemeProvider: Failed to save theme to localStorage', error);
    }
  }, [theme, isReactSafe]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return safe fallback instead of throwing during startup
    console.warn('useTheme: Context undefined, returning fallback');
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      isDark: false
    };
  }
  return context;
};
