// CACHE-FREE THEME SYSTEM - NO REACT DEPENDENCIES
// Generated with unique timestamp to bypass all caching
const CACHE_ID = 'theme-' + Date.now() + '-' + Math.random().toString(36).substring(2);
console.log('🚀 CACHE-FREE THEME:', CACHE_ID);

// Pure JavaScript theme manager - absolutely no React imports
const THEME_STORAGE_KEY = 'app-theme-final';

// Global theme state
let currentTheme: 'light' | 'dark' = 'light';

// Initialize theme immediately
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      currentTheme = stored;
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }
  } catch (e) {
    currentTheme = 'light';
  }
  
  applyThemeToDOM();
  console.log('🎨 CACHE-FREE THEME: Initialized as', currentTheme);
};

// Apply theme directly to DOM
const applyThemeToDOM = () => {
  try {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    root.setAttribute('data-theme', currentTheme);
    console.log('🎨 CACHE-FREE THEME: Applied', currentTheme, 'to DOM');
  } catch (e) {
    console.warn('Theme DOM application failed:', e);
  }
};

// Theme functions
const getTheme = () => currentTheme;
const isDark = () => currentTheme === 'dark';

const setTheme = (newTheme: 'light' | 'dark') => {
  currentTheme = newTheme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  } catch (e) {}
  applyThemeToDOM();
};

// Initialize immediately when this module loads
initializeTheme();

// PURE JAVASCRIPT COMPONENTS - NO REACT ANYWHERE
export const ThemeProvider = ({ children }: any) => {
  console.log('🔥 CACHE-FREE ThemeProvider: Pure JavaScript only');
  
  // Ensure theme is applied (no React hooks)
  applyThemeToDOM();
  
  // Return children directly - no React.Fragment, no hooks
  return children;
};

export const useTheme = () => {
  console.log('🔥 CACHE-FREE useTheme: Pure JavaScript response');
  
  // Return theme object without any React hooks
  return {
    theme: getTheme(),
    setTheme: setTheme,
    isDark: isDark()
  };
};

// Export all theme functions
export { getTheme, setTheme, isDark };

// Default export for compatibility
export default { ThemeProvider, useTheme };

console.log('✅ CACHE-FREE THEME: Module loaded successfully with ID:', CACHE_ID);