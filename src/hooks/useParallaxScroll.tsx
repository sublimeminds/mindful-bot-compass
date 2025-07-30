import { useState, useEffect, useRef, useCallback } from 'react';
import { useEnhancedScreenSize } from './useEnhancedScreenSize';

interface ParallaxOptions {
  speed: number;
  disabled?: boolean;
}

export const useParallaxScroll = (options: ParallaxOptions = { speed: 0.5 }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const { isMobile } = useEnhancedScreenSize();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const updateScrollY = useCallback(() => {
    const newScrollY = window.scrollY;
    setScrollY(newScrollY);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (options.disabled) return;

    const handleScroll = () => {
      requestAnimationFrame(updateScrollY);
    };

    const handleWheel = (e: WheelEvent) => {
      setIsUserScrolling(true);
      setTimeout(() => setIsUserScrolling(false), 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateScrollY, options.disabled]);

  const getParallaxOffset = useCallback((customSpeed?: number) => {
    if (options.disabled) return 0;
    const speed = customSpeed ?? options.speed;
    return scrollY * speed;
  }, [scrollY, options.speed, options.disabled]);

  const getTransform = useCallback((customSpeed?: number) => {
    const offset = getParallaxOffset(customSpeed);
    return `translate3d(0, ${offset}px, 0)`;
  }, [getParallaxOffset]);

  return {
    scrollY,
    isScrolling,
    isUserScrolling,
    getParallaxOffset,
    getTransform,
    isParallaxEnabled: !options.disabled && !isMobile
  };
};

export const useScrollProgress = (sections: string[]) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeIndex = 0;
        
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const sectionId = entry.target.id;
            const index = sections.findIndex(section => section === sectionId);
            if (index !== -1) {
              activeIndex = index;
            }
          }
        });
        
        if (maxRatio > 0.3) {
          setActiveSection(activeIndex);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    const handleScroll = () => requestAnimationFrame(updateProgress);
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string, index?: number) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      if (index !== undefined) {
        setActiveSection(index);
      }
    }
  }, []);

  return {
    activeSection,
    scrollProgress,
    scrollToSection
  };
};