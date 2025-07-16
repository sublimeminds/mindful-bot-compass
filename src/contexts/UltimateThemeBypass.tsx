// ULTIMATE BYPASS: Zero React, completely new filename to bypass ALL caching
console.log('🆘 ULTIMATE BYPASS: Loading cache-free theme system');

// Global theme state - pure JavaScript
let globalTheme: 'light' | 'dark' = 'light';

// Initialize theme immediately without any React
const setupTheme = () => {
  try {
    const saved = localStorage.getItem('app-theme-ultimate');
    globalTheme = (saved === 'light' || saved === 'dark') ? saved : 'light';
  } catch (e) {
    globalTheme = 'light';
  }
  
  // Apply to DOM immediately
  try {
    const root = document.documentElement;
    root.className = root.className.replace(/(^|\s)(light|dark)(\s|$)/g, ' ').trim();
    root.classList.add(globalTheme);
    root.setAttribute('data-theme', globalTheme);
    console.log('🎨 ULTIMATE: Applied theme', globalTheme);
  } catch (e) {
    console.warn('Theme application failed:', e);
  }
};

// Execute immediately
setupTheme();

// Pure functions - no React
export const getTheme = () => globalTheme;
export const isDark = () => globalTheme === 'dark';
export const setTheme = (theme: 'light' | 'dark') => {
  globalTheme = theme;
  try { localStorage.setItem('app-theme-ultimate', theme); } catch (e) {}
  setupTheme();
};

// ZERO React components - just return children
export const ThemeProvider = ({ children }: any) => {
  console.log('🆘 ULTIMATE ThemeProvider: No React hooks, just children');
  setupTheme(); // Ensure theme is applied
  return children;
};

export const useTheme = () => {
  console.log('🆘 ULTIMATE useTheme: Pure JavaScript response');
  return {
    theme: getTheme(),
    setTheme,
    isDark: isDark()
  };
};

export default { ThemeProvider, useTheme };

console.log('✅ ULTIMATE BYPASS: Cache-free theme loaded');