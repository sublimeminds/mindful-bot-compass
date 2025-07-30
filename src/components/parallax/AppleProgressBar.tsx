import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/useParallaxScroll';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

const sections = [
  { id: 'hero', title: 'Welcome', description: 'AI Therapy Platform', icon: '🏠' },
  { id: 'ai-technology', title: 'AI Technology', description: 'Advanced Intelligence', icon: '🧠' },
  { id: 'therapists', title: 'Therapists', description: 'Meet Your AI Team', icon: '👥' },
  { id: 'demo', title: 'Demo', description: 'See It In Action', icon: '💬' },
  { id: 'features', title: 'Features', description: 'Platform Capabilities', icon: '⚡' },
  { id: 'approaches', title: '60+ Methods', description: 'Therapy Approaches', icon: '🎯' },
  { id: 'how-it-works', title: 'Process', description: 'Step-by-Step Guide', icon: '🔄' },
  { id: 'workflow', title: 'AI Workflow', description: 'Behind the Scenes', icon: '⚙️' },
  { id: 'success-stories', title: 'Success Stories', description: 'Real Results', icon: '⭐' },
  { id: 'security', title: 'Security', description: 'HIPAA Compliance', icon: '🔒' },
  { id: 'global-reach', title: 'Global Reach', description: 'Worldwide Access', icon: '🌍' },
  { id: 'benefits', title: 'Benefits', description: 'Why Choose Us', icon: '✨' },
  { id: 'pricing', title: 'Pricing', description: 'Plans & Options', icon: '💎' },
  { id: 'community', title: 'Community', description: 'Connect & Support', icon: '🤝' },
  { id: 'cta', title: 'Get Started', description: 'Begin Your Journey', icon: '🚀' }
];

export default function AppleProgressBar() {
  const { activeSection, scrollProgress, scrollToSection } = useScrollProgress(
    sections.map(s => s.id)
  );
  const { isMobile, isTablet } = useEnhancedScreenSize();

  if (isMobile) {
    return (
      <div className="fixed bottom-safe z-50 left-4 right-4 mb-4">
        <div className="bg-background/90 backdrop-blur-md border border-border/50 rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sections[activeSection]?.icon}</span>
              <div>
                <div className="text-sm font-medium text-foreground">{sections[activeSection]?.title}</div>
                <div className="text-xs text-muted-foreground">{sections[activeSection]?.description}</div>
              </div>
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {activeSection + 1}/{sections.length}
            </div>
          </div>
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300 ease-out",
      isTablet ? "top-6 left-6 right-6" : "top-8 left-1/2 -translate-x-1/2 max-w-6xl"
    )}>
      <div className="bg-background/90 backdrop-blur-md border border-border/50 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center gap-4">
          {/* Current Section Info */}
          <div className="flex items-center gap-3 min-w-fit">
            <span className="text-xl">{sections[activeSection]?.icon}</span>
            <div>
              <div className="text-sm font-semibold text-foreground">{sections[activeSection]?.title}</div>
              <div className="text-xs text-muted-foreground">{sections[activeSection]?.description}</div>
            </div>
          </div>

          {/* Section Dots */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group relative transition-all duration-300 ease-out p-1",
                  "hover:scale-110 focus:outline-none focus:scale-110"
                )}
                aria-label={`Go to ${section.title} section`}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 ease-out",
                  activeSection === index 
                    ? "bg-primary scale-125 shadow-md" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                )} />
                
                {/* Enhanced Tooltip */}
                <div className={cn(
                  "absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100",
                  "transition-all duration-200 ease-out pointer-events-none z-10",
                  "bg-foreground text-background text-xs rounded-xl px-4 py-3 whitespace-nowrap shadow-lg",
                  "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
                  "before:border-[6px] before:border-transparent before:border-t-foreground"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{section.icon}</span>
                    <span className="font-semibold">{section.title}</span>
                  </div>
                  <div className="text-background/80 text-[10px]">{section.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Progress & Section Counter */}
          <div className="text-right min-w-fit">
            <div className="text-sm font-medium text-foreground">
              {activeSection + 1}/{sections.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(scrollProgress)}% complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}