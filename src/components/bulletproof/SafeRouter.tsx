import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from './SafeComponentWrapper';

interface SafeRouterProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SafeRouter: React.FC<SafeRouterProps> = ({ children, fallback }) => {
  return (
    <SafeComponentWrapper name="SafeRouter" fallback={fallback}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </SafeComponentWrapper>
  );
};

export const useSafeNavigation = () => {
  const navigate = useNavigate();

  const safeNavigate = React.useCallback((to: string, options?: { replace?: boolean }) => {
    try {
      navigate(to, options);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      if (options?.replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }
  }, [navigate]);

  return { navigate: safeNavigate };
};