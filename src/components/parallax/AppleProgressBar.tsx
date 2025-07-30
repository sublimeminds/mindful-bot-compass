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

  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
      {isMobile || isTablet ? (
        // Mobile Mini Progress Bar  
        <div className="bg-white/90 backdrop-blur-lg rounded-full p-3 shadow-xl border border-white/50 w-16">
          <div className="text-center">
            <div className="text-xs font-bold text-therapy-600 mb-1">
              {activeSection + 1}
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto">
              <div 
                className="bg-gradient-to-r from-therapy-500 to-healing-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(activeSection + 1) / sections.length * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {sections.length}
            </div>
          </div>
        </div>
      ) : (
        // Desktop Right-Side Navigation
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/50 w-80 max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Page Navigation</h3>
            <div className="text-xs text-gray-500">
              Section {activeSection + 1} of {sections.length}
            </div>
          </div>
          
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-300 group ${
                  index === activeSection
                    ? 'bg-gradient-to-r from-therapy-100 to-healing-100 border border-therapy-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-lg">{section.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    index === activeSection ? 'text-therapy-800' : 'text-gray-700'
                  }`}>
                    {section.title}
                  </div>
                  <div className={`text-xs truncate transition-colors duration-300 ${
                    index === activeSection ? 'text-therapy-600' : 'text-gray-500'
                  }`}>
                    {section.description}
                  </div>
                </div>
                
                {index === activeSection && (
                  <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center mb-2">
              {Math.round(scrollProgress)}% Complete
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-therapy-500 to-healing-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}