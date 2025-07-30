import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/useParallaxScroll';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

const sections = [
  { id: 'hero', title: 'Welcome', description: 'AI Therapy Platform' },
  { id: 'therapists', title: 'Therapists', description: 'Meet Your AI Team' },
  { id: 'demo', title: 'Demo', description: 'See It In Action' },
  { id: 'features', title: 'Features', description: 'Platform Benefits' },
  { id: 'approaches', title: 'Approaches', description: 'Therapy Methods' },
  { id: 'how-it-works', title: 'Process', description: 'How It Works' },
  { id: 'workflow', title: 'Workflow', description: 'AI Integration' },
  { id: 'benefits', title: 'Benefits', description: 'Why Choose Us' },
  { id: 'pricing', title: 'Pricing', description: 'Plans & Pricing' },
  { id: 'cta', title: 'Start', description: 'Begin Your Journey' }
];

export default function AppleProgressBar() {
  const { activeSection, scrollProgress, scrollToSection } = useScrollProgress(
    sections.map(s => s.id)
  );
  const { isMobile, isTablet } = useEnhancedScreenSize();

  if (isMobile) {
    return (
      <div className="fixed bottom-safe z-50 left-4 right-4 mb-4">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground min-w-fit">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300 ease-out",
      isTablet ? "top-6 left-6 right-6" : "top-8 left-1/2 -translate-x-1/2"
    )}>
      <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-6">
          {/* Section Dots */}
          <div className="flex items-center gap-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group relative transition-all duration-300 ease-out",
                  "hover:scale-110 focus:outline-none focus:scale-110"
                )}
                aria-label={`Go to ${section.title} section`}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 ease-out",
                  activeSection === index 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                )} />
                
                {/* Tooltip */}
                <div className={cn(
                  "absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100",
                  "transition-all duration-200 ease-out pointer-events-none",
                  "bg-foreground text-background text-xs rounded-lg px-3 py-2 whitespace-nowrap",
                  "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
                  "before:border-4 before:border-transparent before:border-t-foreground"
                )}>
                  <div className="font-medium">{section.title}</div>
                  <div className="text-background/70 text-[10px]">{section.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Progress Line */}
          <div className="flex-1 h-px bg-border rounded-full overflow-hidden min-w-20">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="text-sm text-muted-foreground min-w-fit font-medium">
            {Math.round(scrollProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
}