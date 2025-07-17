// BULLETPROOF THEME SYSTEM - ZERO REACT DEPENDENCIES
// Absolutely no React imports or hooks to prevent useState errors
// Pure JavaScript implementation with immediate DOM manipulation

console.log('🛡️ BULLETPROOF: Loading zero-dependency theme system...');

const THEME_KEY = 'bulletproof-theme';
type Theme = 'light' | 'dark';

// Global theme state - pure JavaScript
let globalTheme: Theme = 'light';

// Initialize theme immediately without React
const initializeBulletproofTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    globalTheme = (stored === 'light' || stored === 'dark') ? stored : 'light';
  } catch (e) {
    globalTheme = 'light';
  }
  
  // Apply to DOM immediately
  try {
    const root = document.documentElement;
    root.className = root.className.replace(/(^|\s)(light|dark)(\s|$)/g, ' ').trim();
    root.classList.add(globalTheme);
    root.setAttribute('data-theme', globalTheme);
    console.log('🛡️ BULLETPROOF: Applied theme', globalTheme);
  } catch (e) {
    console.warn('Bulletproof theme application failed:', e);
  }
};

// Execute immediately
initializeBulletproofTheme();

// Pure functions - no React
export const getTheme = (): Theme => globalTheme;
export const isDark = (): boolean => globalTheme === 'dark';
export const setTheme = (theme: Theme) => {
  globalTheme = theme;
  try { 
    localStorage.setItem(THEME_KEY, theme); 
  } catch (e) {}
  initializeBulletproofTheme();
};
export const toggleTheme = () => {
  setTheme(globalTheme === 'light' ? 'dark' : 'light');
};

// ZERO React dependencies - pure passthrough component
export const ThemeProvider = ({ children }: any) => {
  console.log('🛡️ BULLETPROOF ThemeProvider: Zero React dependencies, pure passthrough');
  
  // Apply theme immediately without any React lifecycle
  try {
    initializeBulletproofTheme();
  } catch (error) {
    console.warn('Theme initialization warning:', error);
    // Continue even if theme fails - don't break the app
  }
  
  // Return children directly without any React processing
  return children;
};

export const useTheme = () => {
  console.log('🛡️ BULLETPROOF useTheme: Pure JavaScript response');
  return {
    theme: getTheme(),
    setTheme,
    isDark: isDark()
  };
};

export default { ThemeProvider, useTheme };

console.log('✅ BULLETPROOF: Pure JavaScript theme loaded');