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
  { id: 'therapists', title: 'Therapists', description: 'Professional Team', theme: 'flow' },
  { id: 'features', title: 'Features', description: 'Platform Capabilities', theme: 'balance' },
  { id: 'approaches', title: 'Approaches', description: 'Therapy Methods', theme: 'harmony' },
  { id: 'how-it-works', title: 'How It Works', description: 'Step-by-Step Process', theme: 'flow' },
  { id: 'workflow', title: 'Workflow', description: 'AI-Driven Process', theme: 'calm' },
  { id: 'benefits', title: 'Benefits', description: 'Life-Changing Results', theme: 'harmony' },
  { id: 'success-stories', title: 'Success Stories', description: 'Real Testimonials', theme: 'flow' },
  { id: 'security', title: 'Security', description: 'Privacy & Trust', theme: 'calm' },
  { id: 'global-reach', title: 'Global Reach', description: 'Worldwide Access', theme: 'balance' },
  { id: 'community', title: 'Community', description: 'Support Network', theme: 'harmony' },
  { id: 'pricing', title: 'Pricing', description: 'Affordable Plans', theme: 'therapy' },
  { id: 'cta', title: 'Get Started', description: 'Begin Your Journey', theme: 'flow' }
];

const AppleProgressBar = () => {
  const { activeSection, scrollProgress, scrollToSection } = useScrollProgress(sections.map(s => s.id));
  const { isMobile, isTablet } = useEnhancedScreenSize();

  // Smart theme detection based on section colors matching the background themes
  const getSectionTheme = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const themes = {
      therapy: { 
        bg: 'bg-white/95', 
        dot: 'bg-therapy-400', 
        text: 'text-therapy-900', 
        border: 'border-therapy-200',
        activeDot: 'bg-therapy-500 shadow-therapy-500/50'
      },
      calm: { 
        bg: 'bg-white/95', 
        dot: 'bg-calm-400', 
        text: 'text-calm-900', 
        border: 'border-calm-200',
        activeDot: 'bg-calm-500 shadow-calm-500/50'
      },
      harmony: { 
        bg: 'bg-white/95', 
        dot: 'bg-harmony-400', 
        text: 'text-harmony-900', 
        border: 'border-harmony-200',
        activeDot: 'bg-harmony-500 shadow-harmony-500/50'
      },
      flow: { 
        bg: 'bg-white/95', 
        dot: 'bg-flow-400', 
        text: 'text-flow-900', 
        border: 'border-flow-200',
        activeDot: 'bg-flow-500 shadow-flow-500/50'
      },
      balance: { 
        bg: 'bg-white/95', 
        dot: 'bg-balance-400', 
        text: 'text-balance-900', 
        border: 'border-balance-200',
        activeDot: 'bg-balance-500 shadow-balance-500/50'
      },
      blue: { 
        bg: 'bg-white/95', 
        dot: 'bg-blue-400', 
        text: 'text-blue-900', 
        border: 'border-blue-200',
        activeDot: 'bg-blue-500 shadow-blue-500/50'
      }
    };
    return themes[section?.theme as keyof typeof themes] || themes.therapy;
  };

  const currentTheme = getSectionTheme(activeSection);
  const currentSection = sections[activeSection];

  if (isMobile || isTablet) {
    // Mobile/Tablet: Move to right side to avoid header conflict
    return (
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40">
        <div className={cn(
          "border shadow-xl rounded-xl p-2",
          "transition-all duration-500 ease-out",
          currentTheme.bg,
          currentTheme.border
        )}>
          <div className="flex flex-col items-center space-y-2">
            {sections.map((section, index) => {
              const isActive = index === activeSection;
              const isCompleted = activeSection > index;
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isActive 
                      ? "bg-white scale-125 animate-pulse" 
                      : isCompleted
                        ? "bg-white/70"
                        : "bg-white/30 hover:bg-white/50"
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

  // Desktop: Vertical dots with enhanced visibility and section names
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className={cn(
        "relative p-4 rounded-2xl border shadow-2xl",
        "transition-all duration-500 ease-out",
        currentTheme.bg,
        currentTheme.border
      )}>
        {/* Section dots */}
        <div className="flex flex-col space-y-3">
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
                    isActive 
                      ? cn(sectionTheme.activeDot, "scale-125 shadow-lg") 
                      : cn(sectionTheme.dot, "opacity-40 hover:opacity-80 hover:scale-110")
                  )}
                  aria-label={`Go to ${section.title} section`}
                />
                
                {/* Section tooltip */}
                <div className={cn(
                  "absolute right-6 top-1/2 transform -translate-y-1/2",
                  "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300",
                  "pointer-events-none border shadow-xl",
                  sectionTheme.bg,
                  sectionTheme.text,
                  sectionTheme.border
                )}>
                  <div>
                    <div className="font-semibold">{section.title}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
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
};

export default AppleProgressBar;