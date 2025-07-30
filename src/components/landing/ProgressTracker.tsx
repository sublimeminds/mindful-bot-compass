
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

const sections = [
  { id: 'hero', title: 'Welcome', description: 'Introduction to TherapySync', icon: '👋' },
  { id: 'trust', title: 'Trust & Security', description: 'Safety and privacy first', icon: '🛡️' },
  { id: 'demo', title: 'Advanced Demo', description: 'See AI therapy in action', icon: '🎭' },
  { id: 'features', title: 'Features', description: 'Advanced AI capabilities', icon: '⭐' },
  { id: 'therapy-approaches', title: 'Therapy Types', description: 'Comprehensive approaches', icon: '🧠' },
  { id: 'how-it-works', title: 'How It Works', description: 'Simple process overview', icon: '⚙️' },
  { id: 'benefits', title: 'Benefits', description: 'Advanced therapy benefits', icon: '💎' },
  { id: 'pricing', title: 'Pricing', description: 'Choose your plan', icon: '💳' },
  { id: 'cta', title: 'Get Started', description: 'Begin your journey', icon: '🚀' }
];

const ProgressTracker = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewedSections, setViewedSections] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress based on document height
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Track sections that have been viewed (but don't use for progress)
          setViewedSections(prev => {
            if (!prev.includes(sectionId)) {
              return [...prev, sectionId];
            }
            return prev;
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Add scroll listener for progress calculation
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Calculate initial progress

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const completionPercentage = Math.round(scrollProgress);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block">
      <Card className="w-72 shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-therapy-500 via-harmony-500 to-calm-500"></div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-gray-900">Journey Progress</h3>
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 shadow-sm"
            >
              {completionPercentage}%
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-therapy-500 via-harmony-500 to-calm-500 h-3 rounded-full transition-all duration-700 ease-out shadow-inner relative"
              style={{ width: `${completionPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isViewed = viewedSections.includes(section.id);
              
              return (
                  <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group w-full text-left p-3 rounded-xl transition-all duration-300 hover:bg-therapy-50 hover:shadow-sm ${
                    isActive ? 'bg-gradient-to-r from-therapy-50 to-harmony-50 border-l-3 border-therapy-500 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`relative flex-shrink-0 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                      {isViewed ? (
                        <div className="relative">
                          <CheckCircle className="h-5 w-5 text-therapy-500" />
                          <div className="absolute inset-0 bg-therapy-500/20 rounded-full animate-ping"></div>
                        </div>
                      ) : (
                        <Circle className={`h-5 w-5 ${isActive ? 'text-therapy-400' : 'text-gray-400'} group-hover:text-therapy-500 transition-colors`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{section.icon}</span>
                        <div className={`text-sm font-semibold truncate ${
                          isActive ? 'text-therapy-700' : isViewed ? 'text-gray-700' : 'text-gray-500'
                        } group-hover:text-therapy-700 transition-colors`}>
                          {section.title}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 leading-tight line-clamp-2">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
