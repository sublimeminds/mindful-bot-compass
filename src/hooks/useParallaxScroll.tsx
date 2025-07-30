import { useState, useEffect, useRef, useCallback } from 'react';
import { useEnhancedScreenSize } from './useEnhancedScreenSize';

interface ParallaxOptions {
  speed: number;
  disabled?: boolean;
}

export const useParallaxScroll = (options: ParallaxOptions = { speed: 0.5 }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
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
    }, 150);
  }, []);

  useEffect(() => {
    if (options.disabled || isMobile) return;

    const handleScroll = () => {
      requestAnimationFrame(updateScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateScrollY, options.disabled, isMobile]);

  const getParallaxOffset = useCallback((customSpeed?: number) => {
    if (options.disabled || isMobile) return 0;
    const speed = customSpeed ?? options.speed;
    return scrollY * speed;
  }, [scrollY, options.speed, options.disabled, isMobile]);

  const getTransform = useCallback((customSpeed?: number) => {
    const offset = getParallaxOffset(customSpeed);
    return `translate3d(0, ${offset}px, 0)`;
  }, [getParallaxOffset]);

  return {
    scrollY,
    isScrolling,
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const index = sections.findIndex(section => section === sectionId);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        threshold: 0.6, // Increased threshold for better detection
        rootMargin: '-10% 0px -10% 0px' // Improved margins
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

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for any fixed headers
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  return {
    activeSection,
    scrollProgress,
    scrollToSection
  };
};