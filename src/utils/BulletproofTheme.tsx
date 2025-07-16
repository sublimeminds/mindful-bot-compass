// BULLETPROOF THEME SYSTEM
// Uses CSS variables and localStorage for persistence

import React from 'react';

const THEME_KEY = 'bulletproof-theme';
const THEME_CHANGE_EVENT = 'theme-changed';

type Theme = 'light' | 'dark';

class BulletproofThemeManager {
  private currentTheme: Theme = 'light';
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      this.currentTheme = stored;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    this.applyTheme();
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme();
        this.notifyListeners();
      }
    });
  }

  private applyTheme() {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(this.currentTheme);
    root.setAttribute('data-theme', this.currentTheme);
    
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { 
      detail: { theme: this.currentTheme } 
    }));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme) {
    if (theme !== this.currentTheme) {
      this.currentTheme = theme;
      localStorage.setItem(THEME_KEY, theme);
      this.applyTheme();
      this.notifyListeners();
    }
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

const bulletproofTheme = new BulletproofThemeManager();

export const useTheme = () => {
  const [theme, setThemeState] = React.useState(bulletproofTheme.getTheme());

  React.useEffect(() => {
    const unsubscribe = bulletproofTheme.subscribe(setThemeState);
    return unsubscribe;
  }, []);

  return {
    theme,
    setTheme: bulletproofTheme.setTheme.bind(bulletproofTheme),
    isDark: theme === 'dark'
  };
};

export const getTheme = () => bulletproofTheme.getTheme();
export const setTheme = (theme: Theme) => bulletproofTheme.setTheme(theme);
export const toggleTheme = () => bulletproofTheme.toggleTheme();
export const isDark = () => bulletproofTheme.isDark();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    bulletproofTheme.getTheme();
  }, []);
  
  return <>{children}</>;
};

export default {
  ThemeProvider,
  useTheme
};