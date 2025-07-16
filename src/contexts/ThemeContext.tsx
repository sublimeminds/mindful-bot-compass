// ULTRA-SAFE THEME CONTEXT - No hooks, no React dependencies during init
// This file is designed to work even if React is broken or not loaded properly

// Runtime React validation
let React: any;
let isReactAvailable = false;

try {
  React = require('react');
  isReactAvailable = !!(React && React.useState && React.useEffect);
  console.log('✅ React validation passed:', isReactAvailable);
} catch (error) {
  console.warn('⚠️ React import failed:', error);
  // Provide minimal fallbacks
  React = {
    useEffect: () => {},
    useState: (initial: any) => [initial, () => {}],
    Fragment: ({ children }: any) => children
  };
}

type Theme = 'light' | 'dark';

// Direct theme management without React dependencies
class DirectThemeManager {
  private theme: Theme = 'light';

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Safe localStorage access
    try {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        this.theme = stored;
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
        this.theme = prefersDark ? 'dark' : 'light';
      }
    } catch (e) {
      this.theme = 'light';
    }
    
    this.applyTheme();
  }

  private applyTheme() {
    try {
      const root = document.documentElement;
      root.className = root.className.replace(/(^|\s)(light|dark)(\s|$)/g, ' ').trim();
      root.classList.add(this.theme);
      root.setAttribute('data-theme', this.theme);
    } catch (e) {
      console.warn('Theme application failed:', e);
    }
  }

  getTheme() { return this.theme; }
  isDark() { return this.theme === 'dark'; }

  setTheme(newTheme: Theme) {
    this.theme = newTheme;
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
    this.applyTheme();
  }
}

// Create global theme manager
const directTheme = new DirectThemeManager();

// ULTRA-SAFE ThemeProvider - No hooks, just renders children
export const ThemeProvider = ({ children }: { children: any }) => {
  console.log('🔧 ThemeProvider rendering with React available:', isReactAvailable);
  
  // Apply theme immediately without hooks
  directTheme.getTheme();
  
  if (isReactAvailable && React?.Fragment) {
    return React.createElement(React.Fragment, null, children);
  }
  
  // Fallback if React is broken
  return children;
};

// ULTRA-SAFE useTheme hook
export const useTheme = () => {
  console.log('🔧 useTheme called with React available:', isReactAvailable);
  
  if (isReactAvailable) {
    try {
      const [theme, setThemeState] = React.useState(directTheme.getTheme());
      
      React.useEffect(() => {
        const handleThemeChange = () => setThemeState(directTheme.getTheme());
        // Simple polling fallback
        const interval = setInterval(handleThemeChange, 1000);
        return () => clearInterval(interval);
      }, []);

      return {
        theme,
        setTheme: directTheme.setTheme.bind(directTheme),
        isDark: directTheme.isDark()
      };
    } catch (error) {
      console.warn('useTheme hook failed, using fallback:', error);
    }
  }
  
  // Always return working theme object
  return {
    theme: directTheme.getTheme(),
    setTheme: directTheme.setTheme.bind(directTheme),
    isDark: directTheme.isDark()
  };
};

// Export everything for compatibility
export const getTheme = () => directTheme.getTheme();
export const setTheme = (theme: Theme) => directTheme.setTheme(theme);
export const isDark = () => directTheme.isDark();

export default { ThemeProvider, useTheme };