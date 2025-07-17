import { useState, useEffect } from 'react';

// Simple, memory-efficient screen size detection
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') {
      return { 
        isMobile: false, 
        isTablet: false, 
        isLaptop: false, 
        isDesktop: false, 
        width: 0 
      };
    }
    
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isLaptop: width >= 1024 && width < 1280,
      isDesktop: width >= 1280,
      width
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLaptop: width >= 1024 && width < 1280,
        isDesktop: width >= 1280,
        width
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Alternative hook for just mobile detection
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(window.innerWidth < 768);
    
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};