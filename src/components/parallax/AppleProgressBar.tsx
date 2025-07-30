import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/useParallaxScroll';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

// Updated section definitions to match current LandingPage structure
const sections = [
  { id: 'hero', title: 'Welcome', description: 'AI-Powered Therapy Platform', icon: '🌟', theme: 'therapy' },
  { id: 'ai-technology', title: 'AI Technology', description: 'Advanced Intelligence', icon: '🧠', theme: 'blue' },
  { id: 'ai-hub', title: 'AI Hub', description: 'Intelligent Ecosystem', icon: '🤖', theme: 'dark' },
  { id: 'cultural-ai', title: 'Cultural AI', description: 'Global Understanding', icon: '🌏', theme: 'emerald' },
  { id: 'therapists', title: 'Therapists', description: 'Real Professional Team', icon: '👥', theme: 'slate' },
  { id: 'features', title: 'Features', description: 'Platform Capabilities', icon: '⚡', theme: 'indigo' },
  { id: 'approaches', title: 'Approaches', description: 'Therapy Methods', icon: '🎯', theme: 'violet' },
  { id: 'how-it-works', title: 'How It Works', description: 'Step-by-Step Process', icon: '🔄', theme: 'teal' },
  { id: 'workflow', title: 'Workflow', description: 'AI-Driven Process', icon: '⚙️', theme: 'gray' },
  { id: 'benefits', title: 'Benefits', description: 'Life-Changing Results', icon: '✨', theme: 'rose' },
  { id: 'success-stories', title: 'Success Stories', description: 'Real Testimonials', icon: '🏆', theme: 'amber' },
  { id: 'security', title: 'Security', description: 'Privacy & Trust', icon: '🔒', theme: 'green' },
  { id: 'global-reach', title: 'Global Reach', description: 'Worldwide Access', icon: '🌍', theme: 'blue-purple' },
  { id: 'community', title: 'Community', description: 'Support Network', icon: '🤝', theme: 'pink' },
  { id: 'pricing', title: 'Pricing', description: 'Affordable Plans', icon: '💎', theme: 'dark' },
  { id: 'cta', title: 'Get Started', description: 'Begin Your Journey', icon: '🚀', theme: 'therapy' }
];

const AppleProgressBar = () => {
  const { activeSection, scrollProgress, scrollToSection } = useScrollProgress(sections.map(s => s.id));
  const { isMobile, isTablet } = useEnhancedScreenSize();

  // Smart theme detection based on section
  const getSectionTheme = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const themes = {
      therapy: { bg: 'bg-therapy-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      blue: { bg: 'bg-slate-900/90', dot: 'bg-blue-400', text: 'text-gray-900', border: 'border-slate-400/30' },
      emerald: { bg: 'bg-emerald-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      slate: { bg: 'bg-white/90', dot: 'bg-slate-600', text: 'text-slate-900', border: 'border-slate-300/30' },
      indigo: { bg: 'bg-white/90', dot: 'bg-indigo-600', text: 'text-indigo-900', border: 'border-indigo-300/30' },
      violet: { bg: 'bg-violet-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      teal: { bg: 'bg-teal-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      gray: { bg: 'bg-white/90', dot: 'bg-gray-600', text: 'text-gray-900', border: 'border-gray-300/30' },
      rose: { bg: 'bg-rose-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      dark: { bg: 'bg-slate-800/90', dot: 'bg-blue-400', text: 'text-white', border: 'border-slate-600/30' },
      amber: { bg: 'bg-amber-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      green: { bg: 'bg-green-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      'blue-purple': { bg: 'bg-blue-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' },
      pink: { bg: 'bg-pink-900/90', dot: 'bg-white', text: 'text-white', border: 'border-white/30' }
    };
    return themes[section?.theme as keyof typeof themes] || themes.therapy;
  };

  const currentTheme = getSectionTheme(activeSection);
  const currentSection = sections[activeSection];

  if (isMobile || isTablet) {
    // Mobile/Tablet: Circular progress indicator with section info
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={cn(
          "relative w-16 h-16 rounded-full backdrop-blur-xl border shadow-2xl",
          "transition-all duration-500 ease-out",
          currentTheme.bg,
          currentTheme.border
        )}>
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-20"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
              className={cn("transition-all duration-300", currentTheme.text)}
            />
          </svg>
          
          {/* Section Number */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "text-sm font-bold transition-colors duration-500",
            currentTheme.text
          )}>
            {activeSection + 1}
          </div>
          
          {/* Section Icon (on hover) */}
          <div className={cn(
            "absolute -bottom-8 left-1/2 transform -translate-x-1/2",
            "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
            "opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none",
            currentTheme.bg,
            currentTheme.text,
            currentTheme.border,
            "border backdrop-blur-xl shadow-lg"
          )}>
            {currentSection?.title}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Vertical dots with enhanced visibility and section names
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className={cn(
        "relative p-4 rounded-2xl backdrop-blur-xl border shadow-2xl",
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
                    "relative w-3 h-3 rounded-full border-2 transition-all duration-300 ease-out",
                    "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isActive 
                      ? cn(sectionTheme.dot, "scale-125 shadow-lg") 
                      : cn("bg-transparent border-current opacity-60 hover:opacity-100"),
                    isActive ? "border-transparent" : sectionTheme.border.replace('border-', 'border-').replace('/30', '/60')
                  )}
                  aria-label={`Go to ${section.title} section`}
                />
                
                {/* Section tooltip */}
                <div className={cn(
                  "absolute right-6 top-1/2 transform -translate-y-1/2",
                  "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300",
                  "pointer-events-none border backdrop-blur-xl shadow-xl",
                  sectionTheme.bg,
                  sectionTheme.text,
                  sectionTheme.border
                )}>
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{section.icon}</span>
                    <div>
                      <div className="font-semibold">{section.title}</div>
                      <div className="text-xs opacity-75">{section.description}</div>
                    </div>
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