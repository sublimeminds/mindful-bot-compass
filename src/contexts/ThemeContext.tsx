// EMERGENCY REPLACEMENT - No React hooks to prevent useState errors
// This file replaces any cached ThemeContext to prevent crashes

// Simple theme context without hooks
const themeValue = {
  theme: 'light' as const,
  setTheme: () => {},
  isDark: false
};

// ThemeProvider that doesn't use React hooks
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('🟢 EMERGENCY ThemeProvider: Rendering without hooks');
  return children;
};

// useTheme hook replacement that doesn't use React hooks
export const useTheme = () => {
  console.log('🟢 EMERGENCY useTheme: Returning static theme');
  return themeValue;
};

export default { ThemeProvider, useTheme };