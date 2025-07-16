
// Simple theme utilities without React context to prevent hook errors
export const getTheme = () => 'light';
export const setTheme = () => {};
export const isDark = false;

// Simple theme provider that just renders children without any context
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
};

// Static hook replacement that never throws
export const useTheme = () => ({
  theme: 'light' as const,
  setTheme: () => {},
  isDark: false
});
