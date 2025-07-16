// NUCLEAR OPTION: Zero React dependencies, pure DOM manipulation
// This replaces ThemeContext entirely with a non-React system

console.log('🚀 NUCLEAR THEME: Loading theme system without React');

// Pure JavaScript theme manager - no React anywhere
const THEME_STORAGE_KEY = 'app-theme-nuclear';

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
  console.log('🎨 NUCLEAR THEME: Initialized as', currentTheme);
};

// Apply theme directly to DOM
const applyThemeToDOM = () => {
  try {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    root.setAttribute('data-theme', currentTheme);
    console.log('🎨 NUCLEAR THEME: Applied', currentTheme, 'to DOM');
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

// FAKE REACT COMPONENTS - These don't use React at all
export const ThemeProvider = ({ children }: any) => {
  console.log('🔥 NUCLEAR ThemeProvider: Rendering without any React hooks');
  
  // Ensure theme is applied (no React hooks)
  applyThemeToDOM();
  
  // Return children directly - no React.Fragment, no hooks
  return children;
};

export const useTheme = () => {
  console.log('🔥 NUCLEAR useTheme: Returning static theme object');
  
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

console.log('✅ NUCLEAR THEME: Module loaded successfully');