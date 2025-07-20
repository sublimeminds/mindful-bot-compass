
import { useState, useEffect } from 'react';

export interface ScreenSizeState {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  is3Xl: boolean;
  is4Xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltraWide: boolean;
  width: number;
  height: number;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const getBreakpoint = (width: number): ScreenSizeState['breakpoint'] => {
  if (width < 480) return 'xs';
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  if (width < 1400) return '2xl';
  if (width < 1600) return '3xl';
  return '4xl';
};

const calculateScreenState = (width: number, height: number): ScreenSizeState => ({
  isXs: width < 480,
  isSm: width >= 480 && width < 640,
  isMd: width >= 640 && width < 768,
  isLg: width >= 768 && width < 1024,
  isXl: width >= 1024 && width < 1280,
  is2Xl: width >= 1280 && width < 1400,
  is3Xl: width >= 1400 && width < 1600,
  is4Xl: width >= 1600,
  isMobile: width < 768,
  isTablet: width >= 768 && width < 1024,
  isDesktop: width >= 1024 && width < 1600,
  isUltraWide: width >= 1600,
  width,
  height,
  breakpoint: getBreakpoint(width)
});

export const useEnhancedScreenSize = () => {
  const [screenState, setScreenState] = useState<ScreenSizeState>(() => {
    if (typeof window === 'undefined') {
      return calculateScreenState(1024, 768); // Default fallback
    }
    return calculateScreenState(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenState(calculateScreenState(window.innerWidth, window.innerHeight));
      }, 100);
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return screenState;
};

// Hook for container queries
export const useContainerQuery = (containerRef: React.RefObject<HTMLElement>) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return {
    ...containerSize,
    isSmall: containerSize.width < 320,
    isMedium: containerSize.width >= 320 && containerSize.width < 640,
    isLarge: containerSize.width >= 640
  };
};

// Hook for fluid values based on screen size
export const useFluidValue = (
  minValue: number,
  maxValue: number,
  minScreen: number = 320,
  maxScreen: number = 1920
) => {
  const { width } = useEnhancedScreenSize();
  
  if (width <= minScreen) return minValue;
  if (width >= maxScreen) return maxValue;
  
  const ratio = (width - minScreen) / (maxScreen - minScreen);
  return minValue + (maxValue - minValue) * ratio;
};
