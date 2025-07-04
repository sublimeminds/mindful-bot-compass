import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useCallback } from 'react';

// Router-safe navigation hook that falls back to window.location if Router context is not available
export const useSafeNavigation = () => {
  let navigate: NavigateFunction | null = null;
  
  try {
    // Try to get navigate function from Router context
    navigate = useNavigate();
  } catch (error) {
    // Router context not available, will use fallback
    console.warn('Router context not available, using fallback navigation');
    navigate = null;
  }
  
  const safeNavigate = useCallback((path: string) => {
    try {
      if (navigate) {
        // Use Router navigation if available
        navigate(path);
      } else {
        // Fallback to window.location
        console.log('Using fallback navigation to:', path);
        window.location.href = path;
      }
    } catch (error) {
      console.error('Navigation error, using window.location fallback:', error);
      window.location.href = path;
    }
  }, [navigate]);
  
  const safeReplace = useCallback((path: string) => {
    try {
      if (navigate && typeof navigate === 'function') {
        // Use navigate with replace option (React Router v6 syntax)
        navigate(path, { replace: true });
      } else {
        window.location.replace(path);
      }
    } catch (error) {
      console.error('Replace navigation error, using window.location fallback:', error);
      window.location.replace(path);
    }
  }, [navigate]);
  
  return {
    navigate: safeNavigate,
    replace: safeReplace,
    isRouterAvailable: !!navigate
  };
};