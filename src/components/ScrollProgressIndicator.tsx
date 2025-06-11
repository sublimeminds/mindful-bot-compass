
import React, { useState, useEffect } from 'react';

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
            if (elementTop <= window.innerHeight * 0.4 && elementTop + elementHeight > window.innerHeight * 0.4) {
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

  // Don't show the progress indicator for authenticated users on dashboard
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      {/* Enhanced progress bar with smoother gradients */}
      <div className="relative h-1">
        {/* Background track */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        
        {/* Active progress with enhanced styling */}
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            background: scrollProgress > 2 
              ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.8) 0%, rgba(59, 130, 246, 0.9) 50%, rgba(147, 51, 234, 0.8) 100%)'
              : 'transparent',
            boxShadow: scrollProgress > 5 
              ? '0 0 12px rgba(59, 130, 246, 0.5), 0 0 24px rgba(147, 51, 234, 0.3)' 
              : 'none'
          }}
        />
      </div>
      
      {/* Floating section indicator - enhanced design */}
      {scrollProgress > 3 && (
        <div className="absolute top-3 right-4 animate-fade-in">
          <div className="bg-background/90 backdrop-blur-xl border border-border/40 rounded-2xl px-4 py-2 shadow-xl shadow-black/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 animate-ping opacity-30" />
              </div>
              <span className="text-sm font-semibold text-foreground/90 tracking-wide">
                {activeSection === '#features' && 'Features'}
                {activeSection === '#pricing' && 'Pricing'}
                {!activeSection && 'Overview'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollProgressIndicator;
