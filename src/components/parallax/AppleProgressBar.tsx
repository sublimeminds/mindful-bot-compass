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
  const isMobileOrTablet = isMobile || isTablet;
  const currentSectionIndex = typeof activeSection === 'string' ? sections.findIndex(s => s.id === activeSection) : 0;

  // Get section-specific colors for adaptive styling
  const getSectionTheme = (sectionIndex: number) => {
    const themes = [
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // hero - dark theme
      { bg: 'bg-white/30', dot: 'bg-black', text: 'text-black', border: 'border-black/30' }, // ai-technology - light theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // therapists - dark theme
      { bg: 'bg-white/30', dot: 'bg-black', text: 'text-black', border: 'border-black/30' }, // demo - light theme
      { bg: 'bg-white/30', dot: 'bg-black', text: 'text-black', border: 'border-black/30' }, // features - light theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // approaches - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // how-it-works - dark theme
      { bg: 'bg-white/30', dot: 'bg-black', text: 'text-black', border: 'border-black/30' }, // workflow - light theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // success-stories - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // security - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // global-reach - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // benefits - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // pricing - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // community - dark theme
      { bg: 'bg-black/30', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }, // cta - dark theme
    ];
    return themes[sectionIndex] || themes[0];
  };

  const currentTheme = getSectionTheme(currentSectionIndex);

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300",
      isMobileOrTablet ? "bottom-4 right-4 w-16 h-16" : "right-4 top-1/2 -translate-y-1/2 w-16"
    )}>
      {isMobileOrTablet ? (
        // Mobile: Compact circular progress indicator with adaptive colors
        <div className={cn(
          "backdrop-blur-md rounded-full p-3 shadow-lg border transition-all duration-300",
          currentTheme.bg,
          currentTheme.border
        )}>
          <div className="relative w-10 h-10">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={currentTheme.text.includes('white') ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={currentTheme.text.includes('white') ? 'white' : 'black'}
                strokeWidth="2"
                strokeDasharray={`${scrollProgress * 100}, 100`}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-xs font-semibold", currentTheme.text)}>
                {currentSectionIndex + 1}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Desktop: Minimal dots navigation with adaptive colors
        <div className={cn(
          "backdrop-blur-md rounded-full p-3 shadow-lg border transition-all duration-300",
          currentTheme.bg,
          currentTheme.border
        )}>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 relative group",
                  currentSectionIndex === index
                    ? cn(
                        currentTheme.dot,
                        "shadow-sm scale-125",
                        currentTheme.text.includes('white') ? 'shadow-white/50' : 'shadow-black/50'
                      )
                    : currentTheme.text.includes('white') 
                      ? "bg-white/40 hover:bg-white/60" 
                      : "bg-black/40 hover:bg-black/60"
                )}
                title={section.title}
              >
                {/* Tooltip on hover */}
                <div className={cn(
                  "absolute right-full mr-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",
                  currentTheme.text.includes('white') 
                    ? "bg-white/90 text-black" 
                    : "bg-black/90 text-white"
                )}>
                  {section.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}