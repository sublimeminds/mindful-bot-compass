
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ScrollProgressIndicatorProps {
  sections: string[];
  isAuthenticated: boolean;
}

const ScrollProgressIndicator = ({ sections, isAuthenticated }: ScrollProgressIndicatorProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));

      // Find active section for non-authenticated users
      if (!isAuthenticated) {
        const sectionElements = sections.map(section => 
          document.querySelector(section)
        ).filter(Boolean);

        let currentActiveSection = '';
        
        for (const element of sectionElements) {
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Consider section active if it's at least 30% visible
            if (elementTop <= window.innerHeight * 0.3 && elementTop + elementHeight > window.innerHeight * 0.3) {
              currentActiveSection = element.id ? `#${element.id}` : '';
              break;
            }
          }
        }
        
        setActiveSection(currentActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, isAuthenticated]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      {/* Elegant progress bar with gradient */}
      <div className="relative h-1 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-therapy-500 via-therapy-600 to-calm-500 transition-all duration-300 ease-out shadow-sm"
          style={{ 
            width: `${scrollProgress}%`,
            boxShadow: scrollProgress > 5 ? '0 0 8px rgba(14, 165, 233, 0.4)' : 'none'
          }}
        />
      </div>
      
      {/* Section indicator - only show when scrolling */}
      {scrollProgress > 5 && (
        <div className="absolute top-2 right-4 animate-fade-in">
          <div className="bg-background/95 backdrop-blur-md border border-border/30 rounded-full px-3 py-1.5 shadow-lg">
            {!isAuthenticated && activeSection && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground/80">
                  {activeSection === '#features' && 'Features'}
                  {activeSection === '#pricing' && 'Pricing'}
                  {!activeSection && 'Overview'}
                </span>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500" />
                <span className="text-xs font-medium text-foreground/80">
                  {Math.round(scrollProgress)}% read
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollProgressIndicator;
