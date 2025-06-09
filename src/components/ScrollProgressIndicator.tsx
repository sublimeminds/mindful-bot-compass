
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
            
            // Consider section active if it's at least 50% visible
            if (elementTop <= window.innerHeight * 0.5 && elementTop + elementHeight > window.innerHeight * 0.5) {
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
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Progress Bar */}
          <div className="flex-1 mr-4">
            <Progress 
              value={scrollProgress} 
              className="h-2 bg-muted"
            />
          </div>
          
          {/* Active Section Indicator */}
          {!isAuthenticated && activeSection && (
            <div className="text-sm font-medium text-therapy-600 bg-therapy-50 px-3 py-1 rounded-full">
              {activeSection === '#features' && 'Features'}
              {activeSection === '#pricing' && 'Pricing'}
              {!activeSection && 'Top'}
            </div>
          )}
          
          {/* For authenticated users, show current page */}
          {isAuthenticated && (
            <div className="text-sm font-medium text-therapy-600 bg-therapy-50 px-3 py-1 rounded-full">
              Reading Progress: {Math.round(scrollProgress)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressIndicator;
