import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/useParallaxScroll';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

// Updated section definitions to match current LandingPage structure with proper color themes
const sections = [
  { id: 'hero', title: 'Welcome', description: 'AI-Powered Therapy Platform', theme: 'therapy' },
  { id: 'ai-technology', title: 'AI Technology', description: 'Advanced Intelligence', theme: 'blue' },
  { id: 'ai-hub', title: 'AI Hub', description: 'Intelligent Ecosystem', theme: 'calm' },
  { id: 'cultural-ai', title: 'Cultural AI', description: 'Global Understanding', theme: 'harmony' },
  { id: 'mission', title: 'Mission', description: 'Our Purpose', theme: 'therapy' },
  { id: 'therapists', title: 'Therapists', description: 'Professional Team', theme: 'flow' },
  { id: 'features', title: 'Features', description: 'Platform Capabilities', theme: 'balance' },
  { id: 'approaches', title: 'Approaches', description: 'Therapy Methods', theme: 'harmony' },
  { id: 'how-it-works', title: 'How It Works', description: 'Step-by-Step Process', theme: 'flow' },
  { id: 'success-stories', title: 'Success Stories', description: 'Real Testimonials', theme: 'flow' },
  { id: 'security', title: 'Security', description: 'Privacy & Trust', theme: 'calm' },
  { id: 'global-reach', title: 'Global Reach', description: 'Worldwide Access', theme: 'balance' },
  { id: 'community', title: 'Community', description: 'Support Network', theme: 'harmony' },
  { id: 'pricing', title: 'Pricing', description: 'Affordable Plans', theme: 'therapy' },
  { id: 'cta', title: 'Get Started', description: 'Begin Your Journey', theme: 'flow' }
];

const AppleProgressBar = () => {
  try {
    const { activeSection, scrollProgress, scrollToSection } = useScrollProgress(sections.map(s => s.id));
    const { isMobile, isTablet } = useEnhancedScreenSize();

  // Smart theme detection based on section colors matching the background themes
  const getSectionTheme = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const themes = {
      therapy: { 
        bg: 'bg-white', 
        dot: 'bg-therapy-500', 
        text: 'text-therapy-700', 
        border: 'border-therapy-200',
        activeDot: 'bg-therapy-600 shadow-lg'
      },
      calm: { 
        bg: 'bg-white', 
        dot: 'bg-calm-500', 
        text: 'text-calm-700', 
        border: 'border-calm-200',
        activeDot: 'bg-calm-600 shadow-lg'
      },
      harmony: { 
        bg: 'bg-white', 
        dot: 'bg-harmony-500', 
        text: 'text-harmony-700', 
        border: 'border-harmony-200',
        activeDot: 'bg-harmony-600 shadow-lg'
      },
      flow: { 
        bg: 'bg-white', 
        dot: 'bg-flow-500', 
        text: 'text-flow-700', 
        border: 'border-flow-200',
        activeDot: 'bg-flow-600 shadow-lg'
      },
      balance: { 
        bg: 'bg-white', 
        dot: 'bg-balance-500', 
        text: 'text-balance-700', 
        border: 'border-balance-200',
        activeDot: 'bg-balance-600 shadow-lg'
      },
      blue: { 
        bg: 'bg-white', 
        dot: 'bg-blue-500', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        activeDot: 'bg-blue-600 shadow-lg'
      }
    };
    return themes[section?.theme as keyof typeof themes] || themes.therapy;
  };

  const currentTheme = getSectionTheme(activeSection);
  const currentSection = sections[activeSection];

  if (isMobile || isTablet) {
    // Mobile/Tablet: Compact navigation with section tracking
    return (
      <div className="fixed top-1/2 right-1 transform -translate-y-1/2 z-40">
        <div className={cn(
          "border shadow-xl rounded-2xl p-2 w-12",
          "transition-all duration-500 ease-out",
          "bg-white/95 backdrop-blur-sm border-white/30"
        )}>
          {/* Compact title indicator */}
          <div className="text-center mb-2">
            <div className="text-[8px] font-bold text-therapy-600 truncate">
              {currentSection?.title.slice(0, 8)}
            </div>
          </div>
          
          {/* Compact navigation dots */}
          <div className="flex flex-col items-center space-y-1.5">
            {sections.map((section, index) => {
              const isActive = index === activeSection;
              const sectionTheme = getSectionTheme(index);
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isActive 
                      ? cn(sectionTheme.activeDot, "scale-125") 
                      : cn(sectionTheme.dot, "opacity-40 hover:opacity-80")
                  )}
                  aria-label={`Go to ${section.title} section`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Fixed position at absolute right edge with proper section tracking
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flex items-center">
      {/* Compact Section Info - Fixed Width */}
      <div className={cn(
        "mr-1 px-2 py-1 rounded-l-lg border-l border-t border-b shadow-lg text-center",
        "w-24 bg-white/95 backdrop-blur-sm border-white/30",
        "transition-all duration-500 ease-out"
      )}>
        <div className="text-xs font-bold text-therapy-700 truncate">
          {currentSection?.title}
        </div>
      </div>
      
      {/* Dots Container - Completely at edge */}
      <div className={cn(
        "relative p-2 rounded-l-xl border-l border-t border-b shadow-2xl",
        "w-10 bg-white/95 backdrop-blur-sm border-white/30",
        "transition-all duration-500 ease-out"
      )}>
        {/* Section dots */}
        <div className="flex flex-col items-center space-y-3">
          {sections.map((section, index) => {
            const isActive = index === activeSection;
            const sectionTheme = getSectionTheme(index);
            
            return (
              <div key={section.id} className="relative group">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "relative w-3 h-3 rounded-full transition-all duration-300 ease-out",
                    "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "transform hover:rotate-12",
                    isActive 
                      ? cn(sectionTheme.activeDot, "scale-125 shadow-lg animate-pulse") 
                      : cn(sectionTheme.dot, "opacity-40 hover:opacity-80 hover:scale-110")
                  )}
                  style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                  aria-label={`Go to ${section.title} section`}
                />
                
                {/* Enhanced Section tooltip */}
                <div className={cn(
                  "absolute right-6 top-1/2 transform -translate-y-1/2",
                  "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap w-48",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300",
                  "pointer-events-none border shadow-xl backdrop-blur-sm",
                  sectionTheme.bg,
                  sectionTheme.text,
                  sectionTheme.border
                )}>
                  <div>
                    <div className="font-semibold truncate">{section.title}</div>
                    <div className="text-xs opacity-75 truncate">{section.description}</div>
                  </div>
                  
                  {/* Tooltip arrow */}
                  <div className={cn(
                    "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1",
                    "w-2 h-2 rotate-45 border-l border-b",
                    sectionTheme.bg,
                    sectionTheme.border
                  )} />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className={cn(
          "absolute left-2 top-4 bottom-4 w-0.5 rounded-full transition-colors duration-500",
          "bg-current opacity-20"
        )} />
        <div 
          className={cn(
            "absolute left-2 top-4 w-0.5 rounded-full transition-all duration-300",
            currentTheme.dot
          )}
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
    </div>
    );
  } catch (error) {
    console.error('AppleProgressBar error:', error);
    return null;
  }
};

export default AppleProgressBar;