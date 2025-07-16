import React from 'react';

// Empty theme utilities to prevent import errors
export const getTheme = () => 'light';
export const setTheme = () => {};
export const isDark = false;
export const useTheme = () => ({ theme: 'light', setTheme: () => {}, isDark: false });

// No-op ThemeProvider that just renders children
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;